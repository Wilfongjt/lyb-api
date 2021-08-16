// 'use strict';

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// eslint-disable-next-line no-multi-assign
const { describe, it } = exports.lab = Lab.script();

// const Chelate = require('../lib/chelates/chelate.js');
// const Co nsts = require('../lib/constants/co nsts.js');
const GuestTokenPayload = require('../lib/auth/token_payload_guest');

describe('Guest Token Payload', () => {
  const pl = {
    aud: 'lyttlebit-api',
    iss: 'lyttlebit',
    sub: 'client-api',
    user: 'guest',
    scope: 'api_guest',
    key: '0',
  };

  it('GuestTokenPayload Payload', () => {
    const guestTokenPayload = new GuestTokenPayload();
    // console.log('guestTokenPayload',guestTokenPayload.token_payload);
    expect(guestTokenPayload).to.exist();
    expect(guestTokenPayload.token_payload).to.equal(pl);
  });
});
