const SpotifyWebApi = require('spotify-web-api-node');
const { useContext, SpotifyAPIContext } = require('./context');
const { randomOffset, randomMarket, randomCharacter, randomInArray } = require('./utilities/random');
const { formatArtist } = require('./utilities/spotifyAPIData');

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
        limit: 1,
      }
    );

    // No tracks found
    if (!response?.body?.tracks?.items?.length) throw Error('Could not find any tracks');

    // Get a random track
    return randomInArray(response.body.tracks.items);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getRecommendations(track) {
  try {
    const { spotifyAPI, config } = useContext(SpotifyAPIContext);
    const response = await spotifyAPI.getRecommendations({
      seed_tracks: track ? [track, ...(config.seedTracks || [])] : undefined,
      max_popularity: config.maxPopularity,
      min_instrumentalness: config.minInstrumentalness,
      target_instrumentalness: config.targetInstrumentalness,
      seed_genres: config.seedGenres,
      seed_artists: config.seedArtists,
    });
    // Map and filter. Make sure available markets includes the US
    return response.body.tracks.map(({
      id,
      uri,
      name,
      type,
      release_date,
      artists,
      available_markets,
      popularity,
      album,
    }) => {
      return {
        id,
        uri,
        name,
        type,
        releaseDate: release_date,
        artists: artists.map(formatArtist),
        markets: available_markets,
        popularity,
        album: {
          id: album.id,
          uri: album.uri,
          name: album.name,
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          artists: album.artists.map(formatArtist),
        },
      };
    }).filter(track => track.markets.includes('US'));
  } catch (err) {
    // The track probably doesn't have any recommendations
    return [];
  }
}

/**
 * Get a single random track recommendation
 * 
 * @param {string} track 
 */
async function getRecommendation(track) {
  const recommendations = await getRecommendations(track);
  return randomInArray(recommendations);
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

async function replaceAllTracksInPlaylist(playlistID, tracks) {
  // Get playlist info
  const { playlistLength, snapshotId } = await getPlaylist(playlistID);

  // Remove all tracks
  await removeAllTracksFromPlaylist({
    snapshotId,
    playlistLength,
    playlistID,
  });

  // Add new tracks
  await addTracksToPlaylist(playlistID, tracks);

  return {
    message: 'Added tracks to playlist',
    tracks,
  }
}

async function getPlaylist(playlistID) {
  const { spotifyAPI } = useContext(SpotifyAPIContext);
  try {
    const result = await spotifyAPI.getPlaylist(playlistID);
    if (result?.body) {
      return {
        snapshotId: result.body.snapshot_id,
        playlistLength: result.body.tracks.total,
      }
    } else throw Error('No result');
  } catch (err) {
    return {
      snapshotId: null,
      playlistLength: 0,
    }
  }
}

async function removeAllTracksFromPlaylist({ snapshotId, playlistLength, playlistID }) {
  const { spotifyAPI } = useContext(SpotifyAPIContext);
  if (playlistLength === 0) return;
  await spotifyAPI.removeTracksFromPlaylistByPosition(
    playlistID,
    [...Array(playlistLength).keys()],
    snapshotId,
  );
}

async function addTracksToPlaylist(playlistID, tracks) {
  const { spotifyAPI } = useContext(SpotifyAPIContext);
  await spotifyAPI.addTracksToPlaylist(playlistID, tracks);
}

module.exports = {
  setupSpotifyAPI,
  searchForRandomTrack,
  getRecommendations,
  getRecommendation,
  getArtistGenres,
  replaceAllTracksInPlaylist,
}