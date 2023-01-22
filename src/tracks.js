const { useContext, SpotifyAPIContext } = require('./context');
const { searchForRandomTrack, getRecommendations, getArtistGenres } = require('./spotifyAPI');
const { randomInArray } = require('./utilities/random');

async function getAllRandomTracks() {
  const { config } = useContext(SpotifyAPIContext);

  const totalTracks = [];
  while (totalTracks.length < config.tracksPerPeriod) {

    const seedTrack = await searchForRandomTrack();
    const recommendations = await getRecommendations(seedTrack);
    const selectedTrack = randomInArray(recommendations);
    // Make sure the track isn't already in totalTracks
    if (!selectedTrack || totalTracks.includes(selectedTrack?.uri)) continue;
    // Make sure the track artists genres aren't excluded
    if ((await getArtistGenres(selectedTrack.artists)).find(genre => config.excludedGenres.includes(genre))) continue;
    totalTracks.push({
      selectedTrack: selectedTrack.uri,
      seedTrack: `spotify:track:${seedTrack}`, // Convert back to spotify track URI
    });
    console.log(`${totalTracks.length}/${config.tracksPerPeriod}`);
  }
  return totalTracks;
}

module.exports = {
  getAllRandomTracks,
}
