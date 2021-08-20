'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSignupTest extends Step {
  constructor(kind, apiVersion, baseVersion) {
    // $lab:coverage:off$
    super(kind, apiVersion);
    this.baseVersion=baseVersion;
    this.baseKind='base';
    this.name = 'signup';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.jwt_secret = `${this.baseKind}_${this.baseVersion}.get_jwt_secret()`;
  
    this.jwt_claims_guest = `${this.baseKind}_${this.baseVersion}.get_jwt_claims('guest','api_guest','0')`;
    this.jwt_claims_user = `get_jwt_claims('signup@user.com','api_user','duckduckgoose')`;
  
    this.guest_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_guest}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;
  
 
    this.sql = `BEGIN;

    SELECT plan(12);
 
  
    -- 1 INSERT
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'signup',
  
        ARRAY[ 'TEXT', 'JSON', 'TEXT' ],
  
        'Function Signup Insert (text, jsonb, text) exists'
  
    );
  
    -- 2
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        NULL::TEXT,
  
        NULL::JSON
  
      )::JSONB ->> 'status' = '403',
  
      true::Boolean,
  
      'Signup Insert (NULL,NULL) 403 0_0_1'::TEXT
  
    );
  
  -- 3
  
  SELECT is (
    ${this.kind}_${this.version}.signup(
    ${this.guest_token},
      NULL::JSON
    )::JSONB,
    '{"msg": "Bad Request", "status": "400"}'::JSONB,
    'Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
  );
  
    -- 4
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
      ${this.guest_token},
  
        NULL::JSON
  
      )::JSONB,
  
      '{"msg": "Bad Request", "status": "400"}'::JSONB,
  
      'Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
  
    );
  
    -- 5
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
      ${this.guest_token},
  
      '{}'::JSON
  
      )::JSONB,
  
       '{"msg": "Bad Request", "status": "400"}'::JSONB,
  
      'Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
  
    );
  
    -- 6
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'Signup Insert OK 200 0_0_1'::TEXT
  
    );
  
    -- 7
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB ),
  
      '{"msg":"Duplicate","status":"409"}'::JSONB,
  
      'Signup Insert duplicate 409 0_0_1'::TEXT
  
    );
  
    -- 8
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB,
  
      '{"msg":"Bad Request","status":"400"}'::JSONB,
  
      'Signup Insert 400 0_0_1'::TEXT
  
    );
  
    -- 9
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup@user.com","displayname":"J"}'::JSON
  
      )::JSONB ->> 'status' = '400',
  
      true::Boolean,
  
      'Signup Insert 400 0_0_1'::TEXT
  
    );
  
    -- 10
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup2@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'Signup Insert  200 0_0_1'::TEXT
  
    );
  
    -- 11
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup3@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON,
  
        'duckduckgoose'
  
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'Signup Insert 200 0_0_1'::TEXT
  
    );
  
    -- 12
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup1@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB - 'insertion'::TEXT,
  
      '{"msg": "OK", "status": "200"}'::JSONB,
  
      'Signup Insert 401 0_0_1'::TEXT
  
    );

    SELECT * FROM finish();

  ROLLBACK;
    `;
    // console.log('signup test', this.sql);
    // $lab:coverage:on$
  }    
  
};