/* eslint-disable no-multi-assign */
// 'use strict';

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();

const TokenPayload = require('../lib/auth/token_payload');

describe('Token Payload', () => {
  const pl = {
    aud: 'lyttlebit-api',
    iss: 'lyttlebit',
    sub: 'client-api',
    user: 'guest',
    scope: 'api_guest',
    key: '0',
  };

  it('Token Payload', () => {
    const tokenPayload = new TokenPayload();

    expect(tokenPayload).to.exist();
    expect(tokenPayload.payload() === pl);
    expect(tokenPayload.aud('xxx').payload().aud === 'xxx');
    expect(tokenPayload.iss('yyy').payload().iss === 'yyy');
    expect(tokenPayload.sub('aaa').payload().sub === 'aaa');
    expect(tokenPayload.user('bbb').payload().user === 'bbb');
    expect(tokenPayload.scope('ccc').payload().scope === 'ccc');
    expect(tokenPayload.key('duckduckgoose').payload().key === 'duckduckgoose');

    expect(!('key' in tokenPayload.remove('key').payload()));
  });
});
