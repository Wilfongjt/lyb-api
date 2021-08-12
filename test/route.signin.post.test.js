/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-multi-assign */
// 'use strict';
/*
This test has trouble connecting to database
test manually with swagger

const Jwt = require('@hapi/jwt');

// eslint-disable-next-line import/no-extraneous-dependencies
const Lab = require('@hapi/lab');

// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('@hapi/code');

const {
  afterEach, beforeEach, describe, it,
} = exports.lab = Lab.script();

const { init } = require('../lib/server');

const TestTokenPayload = require('./util/token_payload_test');

describe('Signin Route ', () => {
  let server = null;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    console.log('restricted server stop');
    // delete test user
    await server.stop();
    // delete record
  });

  // signin
  it('/signin : guest_token can POST Signin, 200', async () => {
    console.log('sigin test 1');

    // Goal: Singin  application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    // let username = 'signin@user.com';
    const email = 'existing2@user.com';
    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;

    // console.log('server.plugins', server.plugins);
    // eslint-disable-next-line no-underscore-dangle
    // console.log('server.plugins.jwt', server.plugins.jwt._providers);

    // const JWT = server.plugins.jwt;
    // const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
    let token = Jwt.token.generate(payload, secret);
    token = `Bearer ${token}`;
    console.log('token', token);
    console.log('sigin test 2');
    const testForm = {
      username: email,
      displayname: email,
      password: 'a1A!aaaa',
    };
    console.log('sigin test 3');
    // Sigin in
    // test is just for testing dont use in production
    console.log('server', server);
    const res = await server.inject({
      method: 'post',
      url: '/signin',
      headers: {
        authorization: token,
        test: testForm,
      },
      payload: {
        username: email,
        password: 'a1A!aaaa',
      },
    });
    console.log('sigin test 4');
    console.log('res', res.result);
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');

    expect(res.result.token).to.exist();
    console.log('sigin test out');
  });
});
*/
