const { DynamoDB } = require("aws-sdk");

const dynamo = new DynamoDB.DocumentClient();

async function saveToDynamo(tableName, value) {
  console.info('Saving to database', tableName, value?.id);
  await dynamo.put({
    TableName: tableName,
    Item: value,
  }).promise();
}

async function getFromDynamo(tableName, key) {
  const result = await dynamo.get({
    TableName: tableName,
    Key: {
      id: key,
    }
  }).promise();
  return result?.Item || null;
}

module.exports = {
  saveToDynamo,
  getFromDynamo,
}
