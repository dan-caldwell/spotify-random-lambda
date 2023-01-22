const { DynamoDB } = require("aws-sdk");

const dynamo = new DynamoDB.DocumentClient();

async function saveToDynamo() {
  const result = await dynamo.put({
    TableName: 'spotify-daily-background',
    Item: {
      id: '123',
      color: 'orange'
    },
  }).promise();
  console.log(result);
}

module.exports = {
  saveToDynamo,
}