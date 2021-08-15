'use strict';
// const pg = require('pg');
const Step = require('../runner/step');
module.exports = class CreateFunctionUrlDecode extends Step {
  constructor() {
    super();
    // this.kind = kind;
    this.name = `url_decode`;
    this.sql = `CREATE OR REPLACE FUNCTION base_0_0_1.url_decode(data text) RETURNS bytea LANGUAGE sql AS $$
    WITH t AS (SELECT pg_catalog.translate(data, '-_', '+/') AS trans),
         rem AS (SELECT length(t.trans) % 4 AS remainder FROM t) -- compute padding size
        SELECT pg_catalog.decode(
            t.trans ||
            CASE WHEN rem.remainder > 0
               THEN repeat('=', (4 - rem.remainder))
               ELSE '' END,
        'base64') FROM t, rem;
    $$;`;
    // console.log('CreateFunction', this.sql);
  }    
};