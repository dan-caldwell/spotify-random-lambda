const { characters, markets } = require('../data');
const SpotifyWebApi = require('spotify-web-api-node');
const Chance = require('chance');
const Utils = require('./Utils');

const chance = new Chance();

class SpotifyAPI {

    static timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static randomCharacter(numChars = 1) {
        const alphabet = chance.weighted(characters, [...Array(characters.length).keys()].reverse());
        return [...Array(numChars).keys()]
            .map(num => 
                    Utils.getUnicodeCharacter(Utils.randomOffset(alphabet.start, alphabet.end))
                ).join('');
    }

    // Get a random market
    static randomMarket() {
        return markets[Math.floor(Math.random() * markets.length)];
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
        spotifyAPI
    }) {
        const offset = Utils.randomOffset();
        const market = this.randomMarket();
        const query = this.randomCharacter(2);
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

    static async addTracksToPlaylist({
        spotifyAPI,
        tracks,
    }) {
        await spotifyAPI.addTracksToPlaylist(process.env.SPOTIFY_PLAYLIST_ID, tracks);
    }

    static async removeAllTracksFromPlaylist({
        spotifyAPI,
        snapshotId,
        playlistLength
    }) {
        if (playlistLength === 0) return;
        await spotifyAPI.removeTracksFromPlaylistByPosition(
            process.env.SPOTIFY_PLAYLIST_ID,
            [...Array(playlistLength).keys()],
            snapshotId
        );
    }

    static async getPlaylist({
        spotifyAPI
    }) {
        try {
            const result = await spotifyAPI.getPlaylist(process.env.SPOTIFY_PLAYLIST_ID);
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