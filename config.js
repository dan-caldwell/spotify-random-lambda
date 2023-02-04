require('dotenv').config();

module.exports = {
  metaTableName: process.env.META_TABLE,
  background: {
    activePlaylistID: process.env.SPOTIFY_PLAYLIST_ID_BACKGROUND,
    tableName: process.env.DAILY_BG_TABLE,
    tracksPerPeriod: 50,
    marketType: 'western',
    minInstrumentalness: 0.9,
    targetInstrumentalness: 1,
    maxPopularity: 60,
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
      'bohemian baroque',
    ],
  },
  electronic: {
    activePlaylistID: process.env.SPOTIFY_PLAYLIST_ID_ELECTRONIC,
    tableName: process.env.DAILY_ELECTRONIC_TABLE,
    tracksPerPeriod: 10,
    marketType: 'western',
    minInstrumentalness: 0.9,
    targetInstrumentalness: 1,
    maxPopularity: 60,
    excludedGenres: [],
    seedArtists: [
      //'58UpHBCQ1Jj67DJsR7Qyqg', // Uppermost
      //'0G2H8XIsqcdI5GJrYdRRPa', // ESP
      //'30F64wQIHvLiFTGaNZ73nU', // Sewerslvt
      //'3vNPCpgA6iJvFoWQfP3Fli', // South Pole
      //'2ABBMkcUeM9hdpimo86mo6', // Tourist
    ],
    seedTracks: [
      //'4ZvGMcIzhHEnLJWg8XS6op', // Uppermost - Glider
      '6XYGvtMH1CcZj4DVWDl1A3' // Ssaliva - Belly Ache
    ],
  }
}
