const SpotifyAPI = require('../classes/SpotifyAPI');
require('dotenv').config();

describe("getRecommendations", () => {
    test("successfully get recommendations", async () => {
        const spotifyAPI = await SpotifyAPI.setupSpotifyAPI();
        const trackList = [];
        while (trackList.length < 1) {
            const { track: randomTrack } = await SpotifyAPI.searchForRandomTrack({
                spotifyAPI,
                marketType: 'western',
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
            if (tracks.length) trackList.push(...tracks);
        }
    });
});