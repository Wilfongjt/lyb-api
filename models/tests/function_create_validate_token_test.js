'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionCreateValidateTokenTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'validate_token';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.jwt_secret = `${this.kind}_${this.version}.get_jwt_secret()`;
    this.claims = `${this.kind}_${this.version}.get_jwt_claims('guest', 'api_guest', '0')`;
    this.guest_token = `${this.kind}_${this.version}.sign(${this.claims}::JSON, ${this.jwt_secret}::TEXT)`;
  
    this.jwt_claims_user = `${this.kind}_${this.version}.get_jwt_claims('signup@user.com','api_user','0')`;
    this.user_token = `${this.kind}_${this.version}.sign(${this.jwt_claims_user}::JSON, ${this.jwt_secret}::TEXT)::TEXT`; 
    
    this.sql = `BEGIN;

    SELECT plan(3);
  
    SELECT has_function(
        '${this.kind}_${this.version}',
        'validate_token',
        ARRAY[ 'TEXT', 'TEXT' ],
        'Function validate_token(token)'
    );
  
    -- 2 validate_ token guest
    
    SELECT is (
  
      ${this.kind}_${this.version}.validate_token(
        
        ${this.guest_token}::TEXT,
        'api_guest'::TEXT
  
      )::JSONB,
  
      '{"aud": "lyttlebit-api", "iss": "lyttlebit", "key": "0", "sub": "client-api", "user": "guest", "scope": "api_guest"}'::JSONB,
  
      'Good token true 0_0_1'::TEXT
  
    );
  
    -- 3 validate_ token user
    
    SELECT is (
  
      ${this.kind}_${this.version}.validate_token(
        
        ${this.user_token}::TEXT,
        'api_user'::TEXT
  
      )::JSONB,
  
      '{"aud": "lyttlebit-api", "iss": "lyttlebit", "key": "0", "sub": "client-api", "user": "signup@user.com", "scope": "api_user"}'::JSONB,
  
      'Good token true 0_0_1'::TEXT
  
    );
  
    SELECT * FROM finish();
  
  ROLLBACK;
    `;
    // $lab:coverage:on$ 

  }    
};