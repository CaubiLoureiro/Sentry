class Token {
    constructor(tokenId, value, line = null) {
        this.tokenId = tokenId;
        this.value = value;
        this.line = line;
    }

    getTokenId() {
        return this.tokenId;
    }

    getValue() {
        return this.value;
    }

    getLine() {
        return this.line;
    }
}

module.exports = Token;
