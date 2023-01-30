const Chance = require('chance');
const { getUnicodeCharacter } = require('./character');
const { characters, markets, westernMarkets } = require('../../data');

// Get a random offset
function randomOffset(min = 250, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get a random market
function randomMarket(marketType, languageType) {
  let marketList = markets;
  // Get a random western market only when the marketType is 'western'
  // And the language type is not 'latin'
  if (marketType === 'western' && languageType !== 'latin') {
    marketList = westernMarkets;
  }
  return marketList[Math.floor(Math.random() * marketList.length)];
}

function randomCharacter(numChars = 1, marketType, languageType) {
  const chance = new Chance();

  const alphabet = (marketType === "western" || languageType === "latin" ?
    (characters.find(item => item.alphabet === 'latin') || characters[0]) :
    chance.weighted(characters, [...Array(characters.length).keys()].reverse())) || [];

  return [...Array(numChars).keys()].map(function () {
    return getUnicodeCharacter(randomOffset(alphabet.start, alphabet.end));
  }).join('');
}

function randomInArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  randomOffset,
  randomMarket,
  randomCharacter,
  randomInArray,
}