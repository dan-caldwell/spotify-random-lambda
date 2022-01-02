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

            return await this.replaceAllTracks({
                spotifyAPI,
                playlistId,
                tracks: randomTracks
            });

        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async replaceAllTracks({
        spotifyAPI,
        playlistId,
        tracks
    }) {
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
        });

        // Add new tracks
        console.log('Replacing tracks in playlist');
        await SpotifyAPI.addTracksToPlaylist({
            spotifyAPI,
            tracks,
            playlistId
        });

        return {
            message: 'Added tracks to playlist',
            tracks
        }
    }

    static async createBackground({
        playlistId,
        length
    }) {
        try {
            const spotifyAPI = await SpotifyAPI.setupSpotifyAPI();
            const totalTracks = [];
            while (totalTracks.length < length) {
                await SpotifyAPI.timeout(500);
                const randomTrack = await SpotifyAPI.searchForRandomTrack({
                    spotifyAPI
                });
                if (!randomTrack) continue;
                const formattedTrackId = randomTrack.split(':').pop();
                const tracks = await SpotifyAPI.getRecommendations({
                    spotifyAPI,
                    seed_tracks: [formattedTrackId],
                    min_instrumentalness: 0.9,
                    target_instrumentalness: 1,
                    limit: 1
                });
                console.log(`${totalTracks.length}/${length}`);
                // Make sure the track isn't already in totalTracks
                if (tracks.length && totalTracks.includes(tracks[0])) continue;
                totalTracks.push(...tracks);
            }

            return await this.replaceAllTracks({
                spotifyAPI,
                playlistId,
                tracks: totalTracks
            });
        } catch (err) {
            console.error(err);
            return null;
        }
    }

}

module.exports = Response;