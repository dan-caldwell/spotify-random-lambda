class Utils {

    // Get a random offset
    static randomOffset(min = 250, max = 1000) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static generateRandomTrackId() {
        // Latin
        const decodedBase64 = [...Array(this.randomOffset(0, 9)).keys()].map(num => this.getUnicodeCharacter(this.randomOffset(0, 127)));
        return btoa(decodedBase64);
    }

    static getUnicodeCharacter(position) {
        return String.fromCharCode(position);
    }
}

module.exports = Utils;