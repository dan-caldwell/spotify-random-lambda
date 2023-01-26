const { DynamoDB } = require("aws-sdk");

const dynamo = new DynamoDB.DocumentClient();

async function saveToDynamo(tableName, value) {
  console.info('Saving to database', tableName, value);
  await dynamo.put({
    TableName: tableName,
    Item: value,
  }).promise();
}

function getFromDynamo(tableName, key) {
  return dynamo.get({
    TableName: tableName,
    Key: {
      id: key,
    }
  }).promise();
}

module.exports = {
  saveToDynamo,
  getFromDynamo,
}
