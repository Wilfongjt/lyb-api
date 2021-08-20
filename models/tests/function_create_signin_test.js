'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSigninTest extends Step {
  constructor(kind, apiVersion, baseVersion) {
    // $lab:coverage:off$
    super(kind, apiVersion);
    this.baseVersion=baseVersion;
    this.baseKind='base';
    console.log('baseVersion', baseVersion);
    this.name = 'signin';
    this.name = `${this.kind}_${this.version}.${this.name}`;

    this.jwt_claims_guest = `${this.baseKind}_${this.baseVersion}.get_jwt_claims('guest'::TEXT,'api_guest'::TEXT,'0'::TEXT)`;
    
    this.jwt_secret = `${this.baseKind}_${this.baseVersion}.get_jwt_secret()`;
    this.guest_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_guest}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;
  
    this.sql = `BEGIN;
    
      select ${this.kind}_${this.version}.signup(
    
        ${this.guest_token},
    
        '{"username":"signin_1@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
    
      );
    
      SELECT plan(7);
    
      -- 1
    
      SELECT has_function(
    
          '${this.kind}_${this.version}',
    
          'signin',
    
          ARRAY[ 'TEXT', 'JSON' ],
    
          'Function signin (text, json) should exist'
    
      );
    
      -- 2
    
      SELECT is (
    
        ${this.kind}_${this.version}.signin(
    
          NULL::TEXT,
    
          NULL::JSON
    
        )::JSONB ->> 'msg',
    
        'Forbidden'::TEXT,
    
        'signin NO token, NO credentials, Forbidden 0_0_1'::TEXT
    
      );
    
        -- 3
    
      SELECT is (
    
        ${this.kind}_${this.version}.signin(
    
          'bad.token.jjj'::TEXT,
    
          NULL::JSON
    
        )::JSONB ->> 'msg',
    
        'Forbidden'::TEXT,
    
        'signin token BAD, NO credentials, Forbidden 0_0_1'::TEXT
    
      );
    
      -- 4
    
      SELECT is (
    
        ${this.kind}_${this.version}.signin(
    
          NULL::TEXT,
    
          '{"username":"signin@user.com",
    
            "password":"a1A!aaaa"
    
           }'::JSON)::JSONB - 'extra',
    
        '{"msg": "Forbidden", "status": "403"}'::JSONB,
    
        'signin NO token, GOOD credentials,  Forbidden 403 0_0_1'::TEXT
    
      );
    
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.signin(
          ${this.guest_token},
    
          '{"username":"unknown@user.com","password":"a1A!aaaa"}'::JSON
    
        )::JSONB - '{"extra","credentials"}'::TEXT[],
        '{"msg":"Not Found","status":"404"}'::JSONB,
    
        'signin GOOD token Bad Username Credentials 0_0_1'::TEXT
    
      );
    
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.signin(
    
          ${this.guest_token},
    
          '{"username":"signin@user.com","password":"unknown"}'::JSON
    
          )::JSONB - '{"extra","credentials"}'::TEXT[],
    
          '{"msg": "Not Found", "status": "404"}'::JSONB,
    
          'signin GOOD token BAD Password Credentials 404 0_0_1'::TEXT
    
      );
    
      -- 7
        
      SELECT is (
    
        (${this.kind}_${this.version}.signin(
    
          ${this.guest_token},
    
          '{"username":"signin_1@user.com","password":"a1A!aaaa"}'::JSON
    
        )::JSONB || '{"token":"********"}'),
    
        '{"msg": "OK", "token": "********", "status": "200"}'::JSONB,
    
        'signin GOOD token GOOD Credentials 200 0_0_1'::TEXT
    
      );
    
      SELECT * FROM finish();
    
    ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};
