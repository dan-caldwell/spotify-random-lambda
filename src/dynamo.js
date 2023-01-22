const { useContext, SpotifyAPIContext } = require('./context');
const { DynamoDB } = require("aws-sdk");

const dynamo = new DynamoDB.DocumentClient();

async function saveToDynamo(value) {
  const {
    config: {
      tableName,
    },
  } = useContext(SpotifyAPIContext);
  console.info('Saving to database', tableName, value);
  await dynamo.put({
    TableName: tableName,
    Item: value,
  }).promise();
}

module.exports = {
  saveToDynamo,
}
