'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');

const TestTokenPayload = require('./util/token_payload_test.js');
const Jwt = require('@hapi/jwt');

describe('Signup Route ', () => {
  let server = null;

  beforeEach(async () => {

      server = await init();

  });

  afterEach(async () => {
     //console.log('restricted server stop');
     // delete test user

      await server.stop();
      // delete record
  });


  // signup
  it('/signup : guest_token can POST Signup, 200', async () => {
      // Goal: Create an application user
      // Strategy: only guest token can signin
      //           set validation in route route.options.auth
      let username = 'new@user.com';
      let payload = new TestTokenPayload().guest_TokenPayload();
      let secret = process.env.JWT_SECRET;

      let token = 'Bearer ' + Jwt.token.generate(payload, secret);
      const res = await server.inject({
          method: 'post',
          url: '/signup',
          headers: {
            authorization: token,
            rollback: true
          },
          payload: {
            username: username,
            password: 'a1A!aaaa',
            displayname: 'J'
          }
      });
      
      //console.log('test signup', res.result);
      
      expect(res.statusCode).to.equal(200);
      expect(res.result.status).to.equal("200");
      
      //expect(res.result.token).toBeDefined();
  });
  
});
