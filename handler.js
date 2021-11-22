const SpotifyAPI = require('./classes/SpotifyAPI');

module.exports.hello = async event => {

  try {
    const spotifyAPI = await SpotifyAPI.setupSpotifyAPI();

    const randomTracks = [];
    while (randomTracks.length < 20) {
      const randomTrack = await SpotifyAPI.searchForRandomTrack({
        spotifyAPI
      });
      await SpotifyAPI.timeout(500);
      if (randomTrack) {
        randomTracks.push(randomTrack);
      }
    }

    if (!randomTracks.length) {
      return {
        message: 'No tracks added'
      }
    }

    // Get playlist info
    const { playlistLength, snapshotId } = await SpotifyAPI.getPlaylist({
      spotifyAPI
    });

    // Remove all tracks
    console.log('Removing all tracks from playlist');
    await SpotifyAPI.removeAllTracksFromPlaylist({
      spotifyAPI,
      playlistLength,
      snapshotId
    })

    // Add new tracks
    console.log('Replacing tracks in playlist');
    await SpotifyAPI.addTracksToPlaylist({
      spotifyAPI,
      tracks: randomTracks,
    });

    return {
      message: 'Added tracks to playlist',
      tracks: randomTracks
    }

  } catch (err) {
    console.error(err);
    return null;
  }
};
