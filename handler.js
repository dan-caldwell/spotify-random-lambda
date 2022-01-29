const Response = require('./classes/Response');
require('dotenv').config();

module.exports.western = async event => await Response.create({
  marketType: 'western',
  playlistId: process.env.SPOTIFY_PLAYLIST_ID_WESTERN,
  length: 30
});

module.exports.global = async event => await Response.create({
  playlistId: process.env.SPOTIFY_PLAYLIST_ID_GLOBAL,
  length: 30
});

module.exports.background = async event => await Response.createBackground({
  marketType: 'western',
  playlistId: process.env.SPOTIFY_PLAYLIST_ID_BACKGROUND,
  excludedTracks: [
    '23K2pVDTXadG5Rc8H8l0e9',
    '1z8Ryd5EjADc14IFJJvjNH',
    '4yGUguvFScN3z3RteOJq0w'
  ],
  excludedGenres: [
    'orchestra',
    'classical',
    'german opera',
    'german romanticism',
    'late romantic era',
    'classical performance',
    'orchestral performance',
    'nordic orchestra',
    'baroque ensemble',
    'historically informed performance',
    'early music',
    'early music ensemble',
    'musica antigua',
    'viola da gamba',
    'early romantic era',
    'classical cello',
    'british classical piano',
    'baroque',
    'german baroque',
    'classical trumpet',
    'british modern classical',
    'early modern classical',
    'british orchestra',
    'opera',
    'classical era',
    'galante era',
    'baroque cello',
    'choral',
    'classical organ',
    'harpsichord',
    'american orchestra',
    'chinese classical performance',
    'chinese classical piano',
    'classical piano',
    'american choir',
    'lute',
    'english baroque',
    'italian baroque',
    'classical harp',
    'german classical piano',
    'background piano',
    'college marching band', 
    'marching band',
    'greek clarinet',
    'tone',
    'environmental', 
    'rain',
    'ocean',
    'sound',
    'italian classical piano',
    'irish classical',
    'british choir',
    'cambridge choir',
    'russian modern classical',
    'russian classical piano',
    'chamber orchestra',
    'czech classical',
    'hungarian classical performance',
    'german choir',
    'american contemporary classical',
    'bohemian baroque'
  ],
  length: 50
});