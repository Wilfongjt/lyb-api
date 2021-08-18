'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionGetJwtClaims extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'get_jwt_claims';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(user_ TEXT, scope_ TEXT, key_ TEXT) RETURNS JSONB
    AS $$
    BEGIN
        -- POSTGRES_JWT_CLAIMS
        -- RETURN format('{"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"%s", "scope":"%s", "key":"%s"}', user_, scope_, key_)::JSONB;
        -- RETURN current_setting('app.settings.jwt_claims', true)::JSONB;
        RETURN COALESCE(current_setting('app.settings.jwt_claims', true), format('{"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"%s", "scope":"%s", "key":"%s"}', user_, scope_, key_))::JSONB;
    END;  $$ LANGUAGE plpgsql;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};