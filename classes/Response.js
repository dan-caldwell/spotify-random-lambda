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
                const { track: randomTrack } = await SpotifyAPI.searchForRandomTrack({
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
        length,
        marketType,
        excludedGenres = [],
        languageType
    }) {
        try {
            const spotifyAPI = await SpotifyAPI.setupSpotifyAPI();
            const totalTracks = [];

            while (totalTracks.length < length) {
                await SpotifyAPI.timeout(500);
                const { track: randomTrack } = await SpotifyAPI.searchForRandomTrack({
                    spotifyAPI,
                    marketType,
                    languageType
                });
                if (!randomTrack) continue;
                const formattedTrackId = randomTrack.split(':').pop();
                const tracks = await SpotifyAPI.getRecommendations({
                    spotifyAPI,
                    seed_tracks: [formattedTrackId],
                    min_instrumentalness: 0.9,
                    target_instrumentalness: 1,
                    max_popularity: 60
                });
                // Get a random track from the tracks returned
                const randomTrackInTracks = tracks[Math.floor(Math.random() * tracks.length)];
                // Make sure the track isn't already in totalTracks
                if (!randomTrackInTracks || totalTracks.includes(randomTrackInTracks?.uri)) continue;
                // Make sure the track artists genres aren't excluded
                const genres = await SpotifyAPI.getArtistGenres({
                    spotifyAPI,
                    artists: randomTrackInTracks.artists
                });
                if (genres.find(genre => excludedGenres.includes(genre))) {
                    console.log('Excluded genre found, ignoring', genres);
                    continue;
                }
                console.log(genres);
                totalTracks.push(randomTrackInTracks.uri);
                console.log(`${totalTracks.length}/${length}`);
            }

            return await this.replaceAllTracks({
                spotifyAPI,
                playlistId,
                tracks: totalTracks
            });
        } catch (err) {
            console.dir(err, { depth: null });
            return null;
        }
    }

}

module.exports = Response;