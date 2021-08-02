'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

//const Chelate = require('../lib/chelates/chelate.js');
//const Consts = require('../lib/constants/consts.js');
const TokenPayload = require('../lib/auth/token_payload.js');

describe('Token Payload', () => {
  let pl = {
    aud: "lyttlebit-api",
    iss: "lyttlebit",
    sub: "client-api",
    user: "guest",
    scope: "api_guest",
    key: "0"
} 
  it('Token Payload', () => {

    let tokenPayload = new TokenPayload();
    //console.log(tokenPayload);
    expect(tokenPayload).to.exist();
    expect(tokenPayload.payload === pl);

  })


});
