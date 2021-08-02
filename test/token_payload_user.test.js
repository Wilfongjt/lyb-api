'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

//const Chelate = require('../lib/chelates/chelate.js');
//const Consts = require('../lib/constants/consts.js');
const UserTokenPayload = require('../lib/auth/token_payload_user.js');

describe('User Token Payload', () => {
  
  let pl = {
    aud: "lyttlebit-api",
    iss: "lyttlebit",
    key: "duckduckgoose",
    scope: "api_user",
    sub: "client-api",
    user: "user@user.com"
  } 
  
  it('UserTokenPayload Payload', () => {

    let userTokenPayload = new UserTokenPayload(pl.user, pl.key);
    //console.log('guestTokenPayload',guestTokenPayload.token_payload);
    expect(userTokenPayload).to.exist();
    expect(userTokenPayload.token_payload.user).to.equal(pl.user);
    expect(userTokenPayload.token_payload.key).to.equal(pl.key);

  })


});
