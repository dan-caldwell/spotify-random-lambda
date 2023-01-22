const Response = require('./classes/Response');
const { setupSpotifyAPI, searchForRandomTrack, getRecommendations, getArtistGenres } = require('./src/spotifyAPI');
const config = require('./config');
const { SpotifyAPIContext } = require('./src/context');
const { randomInArray } = require('./src/utilities/random');
require('dotenv').config();

async function backgroundV2(event) {

  const spotResult = await SpotifyAPIContext.Provider(
    {
      spotifyAPI: await setupSpotifyAPI(),
      config: config.background,
    },
    async () => {

      const totalTracks = [];
      while (totalTracks.length < config.background.tracksPerPeriod) {

        const track = await searchForRandomTrack();
        const recommendations = await getRecommendations(track);
        const selectedTrack = randomInArray(recommendations);
        // Make sure the track isn't already in totalTracks
        if (!selectedTrack || totalTracks.includes(selectedTrack?.uri)) continue;
        // Make sure the track artists genres aren't excluded
        if ((await getArtistGenres(selectedTrack.artists)).find(genre => config.background.excludedGenres.includes(genre))) continue;
        totalTracks.push(selectedTrack.uri);
        console.log(`${totalTracks.length}/${config.background.tracksPerPeriod}`);
      }
      return totalTracks;
    }
  );

  console.log(spotResult);
}

// async function getRandomTracks() {
//   const totalTracks = [];
//   while (totalTracks.length < config.background.tracksPerPeriod) {
//     await timeout(500);

//   }
// }

async function background(event) {
  return await Response.createBackground({
    marketType: 'western',
    playlistId: process.env.SPOTIFY_PLAYLIST_ID_BACKGROUND,
    excludedTracks: [
      '23K2pVDTXadG5Rc8H8l0e9',
      '1z8Ryd5EjADc14IFJJvjNH',
      '4yGUguvFScN3z3RteOJq0w',
      '4VbOIkKqt0gkZpC75oKSxS',
      '6TXAZHsvrI7Ki20wTZAeu7',
      '45f7SKLlIyaUhdo8bzObnD',
      '7kIYAXh66T1wV0jLCiDFn6',
      '47fIyWY81h5QmLA1aUj7rv',
      '6dDxgfvM8pJm7AzmLZB1nN',
      '5p3sL0m7PPpJnUr5snK5SQ',
      '5m5I3KcV83zf2p2qbsnr3y'
    ],
    excludedGenres: [
      'orchestra',
      'classical',
      'german opera',
      'german romanticism',
      'late romantic era',
      'classical performance',
      'orchestral performance',
      'nordic orchestra',
      'baroque ensemble',
      'historically informed performance',
      'early music',
      'early music ensemble',
      'musica antigua',
      'viola da gamba',
      'early romantic era',
      'classical cello',
      'british classical piano',
      'baroque',
      'german baroque',
      'classical trumpet',
      'british modern classical',
      'early modern classical',
      'british orchestra',
      'opera',
      'classical era',
      'galante era',
      'baroque cello',
      'choral',
      'classical organ',
      'harpsichord',
      'american orchestra',
      'chinese classical performance',
      'chinese classical piano',
      'classical piano',
      'american choir',
      'lute',
      'english baroque',
      'italian baroque',
      'classical harp',
      'german classical piano',
      'background piano',
      'college marching band',
      'marching band',
      'greek clarinet',
      'tone',
      'environmental',
      'rain',
      'ocean',
      'sound',
      'italian classical piano',
      'irish classical',
      'british choir',
      'cambridge choir',
      'russian modern classical',
      'russian classical piano',
      'chamber orchestra',
      'czech classical',
      'hungarian classical performance',
      'german choir',
      'american contemporary classical',
      'bohemian baroque'
    ],
    length: 50
  });
}

module.exports = {
  backgroundV2,
  background,
}