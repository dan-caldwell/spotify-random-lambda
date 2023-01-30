const dayjs = require('dayjs');
const { useContext, SpotifyAPIContext } = require('./context');
const { searchForRandomTrack, getArtistGenres, getRecommendation } = require('./spotifyAPI');
const { getFromDynamo } = require('./dynamo');

async function getAllRandomTracks() {
  const { config } = useContext(SpotifyAPIContext);

  const totalTracks = [];
  while (totalTracks.length < config.tracksPerPeriod) {
    const seedTrack = await searchForRandomTrack();
    const selectedTrack = await getRecommendation(seedTrack);
    // Returns the genres
    const filterPass = await doesTrackPassFilters(selectedTrack, totalTracks);
    if (!filterPass) continue;
    totalTracks.push({
      ...selectedTrack,
      ...filterPass,
      seedTrack, // Convert back to spotify track URI
      dateAdded: dayjs().valueOf(),
    });
    console.log(`${totalTracks.length}/${config.tracksPerPeriod}`);
  }
  return totalTracks;
}

/**
 * Check if the track passes the filteres
 * 
 * @param {string} track 
 * @param {object[]} totalTracks 
 * @returns false | { genres }
 */
async function doesTrackPassFilters(track, totalTracks) {
  const { config } = useContext(SpotifyAPIContext);
  // Make sure the track isn't already in totalTracks
  if (!track || totalTracks.find(({ id }) => id === track?.id)) return false;
  // Make sure the track doesn't already exist in the dynamo table
  if (await getFromDynamo(config.tableName, track.id)) {
    console.info('Track already exists in database', track.id);
    return false;
  }
  // Make sure the track artists genres aren't excluded
  const genres = await getArtistGenres(track.artists.map(artist => artist?.id));
  if ((genres || [])?.find(genre => config.excludedGenres.includes(genre))) return false;
  return {
    genres,
  }
}

module.exports = {
  getAllRandomTracks,
}
