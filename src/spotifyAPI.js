const SpotifyWebApi = require('spotify-web-api-node');
const { useContext, SpotifyAPIContext } = require('./context');
const { randomOffset, randomMarket, randomCharacter, randomInArray } = require('./utilities/random');

async function setupSpotifyAPI() {
  // Set up API
  const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_SECRET
  });
  spotifyAPI.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);
  const clientData = await spotifyAPI.refreshAccessToken();
  spotifyAPI.setAccessToken(clientData.body['access_token']);
  return spotifyAPI;
}

async function searchForRandomTrack() {
  const {
    spotifyAPI,
    config: {
      marketType,
      languageType,
    }
  } = useContext(SpotifyAPIContext);
  try {
    const response = await spotifyAPI.searchTracks(
      randomCharacter(2, marketType, languageType),
      {
        offset: randomOffset(),
        market: randomMarket(),
        limit: 1
      }
    );

    // No tracks found
    if (!response?.body?.tracks?.items?.length) throw Error('Could not find any tracks');

    // Return the track formatted
    return (response.body.tracks.items[0].uri).split(':').pop();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getRecommendations(track) {
  try {
    const { spotifyAPI, config } = useContext(SpotifyAPIContext);
    const response = await spotifyAPI.getRecommendations({
      seed_tracks: [track],
      max_popularity: config.maxPopularity,
      min_instrumentalness: config.minInstrumentalness,
      target_instrumentalness: config.targetInstrumentalness,
    });
    // Map and filter. Make sure available markets includes the US
    return response.body.tracks.map(track => ({
      uri: track.uri,
      artists: track.artists.map(artist => artist.id),
      markets: track.available_markets
    })).filter(track => track.markets.includes('US'));
  } catch (err) {
    // The track probably doesn't have any recommendations
    return [];
  }
}

async function getArtistGenres(artists) {
  try {
    const { spotifyAPI } = useContext(SpotifyAPIContext);
    const {
      body: {
        artists: artistResult
      }
    } = await spotifyAPI.getArtists(artists);
    return (artistResult || []).reduce((total, item) => {
      if (item.genres) {
        total.push(...item.genres);
      }
      return total;
    }, []);
  } catch (err) {
    // The artist probably has no genres listed
    return [];
  }
}

module.exports = {
  setupSpotifyAPI,
  searchForRandomTrack,
  getRecommendations,
  getArtistGenres,
}