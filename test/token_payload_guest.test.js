'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

//const Chelate = require('../lib/chelates/chelate.js');
//const Consts = require('../lib/constants/consts.js');
const GuestTokenPayload = require('../lib/auth/token_payload_guest.js');

describe('Guest Token Payload', () => {
  
  let pl = {
    aud: "lyttlebit-api",
    iss: "lyttlebit",
    sub: "client-api",
    user: "guest",
    scope: "api_guest",
    key: "0"
  } 
  
  it('GuestTokenPayload Payload', () => {

    let guestTokenPayload = new GuestTokenPayload();
    //console.log('guestTokenPayload',guestTokenPayload.token_payload);
    expect(guestTokenPayload).to.exist();
    expect(guestTokenPayload.token_payload).to.equal(pl);

  })


});
