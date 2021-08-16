'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionGetJwtClaims extends Step {
  constructor() {
    super();
    // this.kind = kind;
    this.name = `get_jwt_claims`;
    this.sql = `CREATE OR REPLACE FUNCTION base_0_0_1.get_jwt_claims(user_ TEXT, scope_ TEXT, key_ TEXT) RETURNS JSONB
    AS $$
    BEGIN
        -- POSTGRES_JWT_CLAIMS
        RETURN format('{"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"%s", "scope":"%s", "key":"%s"}', user_, scope_, key_)::JSONB;
        -- RETURN current_setting('app.settings.jwt_claims')::JSONB;
    END;  $$ LANGUAGE plpgsql;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};