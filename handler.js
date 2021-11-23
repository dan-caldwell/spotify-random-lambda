const Response = require('./classes/Response');

module.exports.western = async event => await Response.create({
  marketType: 'western',
  playlistId: process.env.SPOTIFY_PLAYLIST_ID_WESTERN,
  length: 30
});

module.exports.global = async event => await Response.create({
  playlistId: process.env.SPOTIFY_PLAYLIST_ID_GLOBAL,
  length: 30
});
