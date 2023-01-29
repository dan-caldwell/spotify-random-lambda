require('dotenv').config();
const dayjs = require('dayjs');
const { setupSpotifyAPI, replaceAllTracksInPlaylist } = require('./src/spotifyAPI');
const { getAllRandomTracks } = require('./src/tracks');
const { SpotifyAPIContext } = require('./src/context');
const { saveToDynamo } = require('./src/dynamo');
const config = require('./config');

async function background() {
  try {
    await SpotifyAPIContext.Provider(
      {
        spotifyAPI: await setupSpotifyAPI(),
        config: config.background,
      },
      async () => {
        const today = dayjs();
        const batchId = today.valueOf();
        const randomTracks = await getAllRandomTracks();
        for (const track of randomTracks) {
          await saveToDynamo(
            config.background.tableName,
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
        await replaceAllTracksInPlaylist(config.background.activePlaylistID, randomTracks.map(track => track.uri));
      }
    );
  } catch (err) {
    console.error('Daily background failed', err);
  }
}

module.exports = {
  background,
}