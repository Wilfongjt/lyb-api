'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSign extends Step {
  constructor() {
    super();
    // this.kind = kind;
    this.name = `sign`;
    this.sql = `CREATE OR REPLACE FUNCTION base_0_0_1.sign(payload json, secret text, algorithm text DEFAULT 'HS256')
    RETURNS text LANGUAGE sql AS $$
    WITH
      header AS (
        SELECT base_0_0_1.url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
        ),
      payload AS (
        SELECT base_0_0_1.url_encode(convert_to(payload::text, 'utf8')) AS data
        ),
      signables AS (
        SELECT header.data || '.' || payload.data AS data FROM header, payload
        )
    SELECT
        signables.data || '.' ||
        base_0_0_1.algorithm_sign(signables.data, secret, algorithm) FROM signables;
    $$;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};