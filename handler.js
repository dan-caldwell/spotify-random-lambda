require('dotenv').config();
const dayjs = require('dayjs');
const Response = require('./classes/Response');
const { setupSpotifyAPI } = require('./src/spotifyAPI');
const { getAllRandomTracks } = require('./src/tracks');
const { SpotifyAPIContext } = require('./src/context');
const { saveToDynamo } = require('./src/dynamo');
const config = require('./config');

async function backgroundV2() {

  const spotResult = await SpotifyAPIContext.Provider(
    {
      spotifyAPI: await setupSpotifyAPI(),
      config: config.background,
    },
    async () => {
      const today = dayjs();
      const randomTracks = await getAllRandomTracks();
      for (const track of randomTracks) {
        await saveToDynamo({
          ...track,
          year: today.year(),
          month: today.month(),
          date: today.date(),
        });
      }
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