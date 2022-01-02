const { characters, markets, westernMarkets } = require('../data');
const SpotifyWebApi = require('spotify-web-api-node');
const Chance = require('chance');
const Utils = require('./Utils');

const chance = new Chance();

class SpotifyAPI {

    static timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static randomCharacter(numChars = 1, marketType) {
        let alphabet = [];
        if (marketType === "western") {
            alphabet = characters.find(item => item.alphabet === 'latin') || characters[0];
        } else {
            alphabet = chance.weighted(characters, [...Array(characters.length).keys()].reverse());
        }
        return [...Array(numChars).keys()]
            .map(num =>
                Utils.getUnicodeCharacter(Utils.randomOffset(alphabet.start, alphabet.end))
            ).join('');
    }

    // Get a random market
    static randomMarket(marketType) {
        let marketList = markets;
        if (marketType === 'western') {
            marketList = westernMarkets;
        }
        return marketList[Math.floor(Math.random() * marketList.length)];
    }

    static async setupSpotifyAPI() {
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

    static async searchForRandomTrack({
        spotifyAPI,
        marketType = null
    }) {
        const offset = Utils.randomOffset();
        const market = this.randomMarket(marketType);
        const query = this.randomCharacter(2, marketType);
        try {
            const response = await spotifyAPI.searchTracks(query, {
                offset,
                market,
                limit: 1
            });

            if (response?.body?.tracks?.items?.length) {
                const track = response.body.tracks.items[0].uri;
                console.log({
                    offset,
                    market,
                    query,
                    track
                });
                return track;
            }
            console.log({
                offset,
                market,
                query,
                track: null
            });
            return null;
        } catch (err) {
            console.log('Could not find any tracks');
            return null;
        }

    }

    static async getRecommendations({
        spotifyAPI,
        seed_genres,
        seed_tracks,
        max_energy,
        max_popularity,
        min_instrumentalness,
        target_instrumentalness,
        limit
    }) {
        try {
            const response = await spotifyAPI.getRecommendations({
                seed_tracks,
                max_energy,
                max_popularity,
                min_instrumentalness,
                target_instrumentalness,
                seed_genres,
                limit
            });
            const tracks = response.body.tracks.map(track => track.uri);
            return tracks;
        } catch (err) {
            console.log(err);
            console.error('Could not get tracks');
            return [];
        }

    }

    static async addTracksToPlaylist({
        spotifyAPI,
        tracks,
        playlistId
    }) {
        await spotifyAPI.addTracksToPlaylist(playlistId, tracks);
    }

    static async removeAllTracksFromPlaylist({
        spotifyAPI,
        snapshotId,
        playlistLength,
        playlistId
    }) {
        if (playlistLength === 0) return;
        await spotifyAPI.removeTracksFromPlaylistByPosition(
            playlistId,
            [...Array(playlistLength).keys()],
            snapshotId
        );
    }

    static async getPlaylist({
        spotifyAPI,
        playlistId
    }) {
        try {
            const result = await spotifyAPI.getPlaylist(playlistId);
            if (result?.body) {
                return {
                    snapshotId: result.body.snapshot_id,
                    playlistLength: result.body.tracks.total
                }
            } else throw Error('No result');
        } catch (err) {
            console.error(err);
            return {
                snapshotId: null,
                playlistLength: 0
            }
        }
    }

}

module.exports = SpotifyAPI;