const TokenPayload = require('./token_payload.js');

module.exports = class UserTokenPayload extends TokenPayload {
    constructor(username, key){
        super();
        this.user(username);
        this.key(key);
    }

};
