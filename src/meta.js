const dayjs = require('dayjs');
const { metaTableName } = require('../config');
const { useContext, SpotifyAPIContext } = require('./context');
const { getFromDynamo } = require('./dynamo');

async function doesPlaylistExistForMonth() {
  const {
    config: {
      tableName,
    },
  } = useContext(SpotifyAPIContext);

  const today = dayjs();
  const month = today.month();

  // First just check if the entry exists
  const result = await getFromDynamo(metaTableName, tableName); // The table name is the key
  const playlists = JSON.parse(result?.playlists || '[]');

  console.info({ playlists })

  if (!result) return false;

}

module.exports = {
  doesPlaylistExistForMonth,
}
