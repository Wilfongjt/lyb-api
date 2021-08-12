/* eslint-disable dot-notation */
/* eslint-disable no-multi-assign */
// 'use strict';
/*
This test has trouble connecting to database
test manually with swagger

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

const {
  after,
  before,
  describe,
  it,
} = exports.lab = Lab.script();

const Jwt = require('@hapi/jwt');

const { init } = require('../lib/server');

const TestTokenPayload = require('./util/token_payload_test');

describe('Signup Route ', () => {
  let server = null;

  before(async () => {
    server = await init();
  });

  after(async () => {
    // console.log('restricted server stop');
    // delete test user
    await server.stop();
    // delete record
  });

  // signup
  it('/signup : guest_token can POST Signup, 200', async () => {
    // Goal: Create an application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    const username = 'new@user.com';
    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;

    // var db = request.server.plugins['hapi-sequelized'].models;

    // const JWT = server.plugins['Jwt'];
    // const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
    // const token = `Bearer ${JWT.token.generate(payload, secret)}`;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: '/signup',
      headers: {
        authorization: token,
        rollback: true,
      },
      payload: {
        username,
        password: 'a1A!aaaa',
        displayname: 'J',
      },
    });
    // console.log('test signup', res.result);
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');

    // expect(res.result.token).toBeDefined();
  });
});
*/
