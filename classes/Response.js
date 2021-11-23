const SpotifyAPI = require('./SpotifyAPI');

class Response {

    static async create({
        marketType,
        playlistId,
        length = 30
    }) {
        try {
            const spotifyAPI = await SpotifyAPI.setupSpotifyAPI();

            const randomTracks = [];
            while (randomTracks.length < length) {
                const randomTrack = await SpotifyAPI.searchForRandomTrack({
                    spotifyAPI,
                    marketType
                });
                await SpotifyAPI.timeout(500);
                if (randomTrack) {
                    randomTracks.push(randomTrack);
                    console.log(`${randomTracks.length}/${length}`)
                }
            }

            if (!randomTracks.length) {
                return {
                    message: 'No tracks added'
                }
            }

            // Get playlist info
            const { playlistLength, snapshotId } = await SpotifyAPI.getPlaylist({
                spotifyAPI,
                playlistId
            });

            // Remove all tracks
            console.log('Removing all tracks from playlist');
            await SpotifyAPI.removeAllTracksFromPlaylist({
                spotifyAPI,
                playlistLength,
                snapshotId,
                playlistId
            })

            // Add new tracks
            console.log('Replacing tracks in playlist');
            await SpotifyAPI.addTracksToPlaylist({
                spotifyAPI,
                tracks: randomTracks,
                playlistId
            });

            return {
                message: 'Added tracks to playlist',
                tracks: randomTracks
            }

        } catch (err) {
            console.error(err);
            return null;
        }
    }

}

module.exports = Response;