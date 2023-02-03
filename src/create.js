const dayjs = require('dayjs');
const { setupSpotifyAPI, replaceAllTracksInPlaylist } = require('./spotifyAPI');
const { getAllRandomTracks } = require('./tracks');
const { saveToDynamo } = require('./dynamo');
const { SpotifyAPIContext } = require('./context');
const config = require('../config');

async function create(key) {
  try {
    await SpotifyAPIContext.Provider(
      {
        spotifyAPI: await setupSpotifyAPI(),
        config: config[key],
      },
      async () => {
        const today = dayjs();
        const batchId = today.valueOf();
        const randomTracks = await getAllRandomTracks();
        for (const track of randomTracks) {
          await saveToDynamo(
            config[key].tableName,
            {
              ...track,
              markets: undefined,
              date: {
                year: today.year(),
                month: today.month(),
                date: today.date(),
              },
              day: today.format('YYYY-MM-DD'),
              batchId,
            }
          );
        }
        // Create the new playlist
        await replaceAllTracksInPlaylist(config[key].activePlaylistID, randomTracks.map(track => track.uri));
      }
    );
    // Reset context just in case
    SpotifyAPIContext.Reset();
  } catch (err) {
    console.error('Daily', key, 'failed', err);
  }
}

module.exports = {
  create,
}
