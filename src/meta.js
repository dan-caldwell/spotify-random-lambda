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
  const { playlists } = await getFromDynamo(metaTableName, tableName); // The table name is the key

  if (!playlists) return false;

}

module.exports = {
  doesPlaylistExistForMonth,
}
