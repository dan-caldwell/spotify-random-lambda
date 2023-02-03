require('dotenv').config();
const { create } = require('./src/create');

async function background() {
  await create('background');
}

async function electronic() {
  await create('electronic');
}

module.exports = {
  background,
  electronic,
}
