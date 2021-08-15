'use strict';
// const pg = require('pg');
const Step = require('../runner/step');
module.exports = class CreateFunctionSign extends Step {
  constructor() {
    super();
    // this.kind = kind;
    this.name = `verify`;
    this.sql = `CREATE OR REPLACE FUNCTION base_0_0_1.verify(token text, secret text, algorithm text DEFAULT 'HS256')
    RETURNS table(header json, payload json, valid boolean) LANGUAGE sql AS $$
      SELECT
        convert_from(base_0_0_1.url_decode(r[1]), 'utf8')::json AS header,
        convert_from(base_0_0_1.url_decode(r[2]), 'utf8')::json AS payload,
        r[3] = base_0_0_1.algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
      FROM regexp_split_to_array(token, '\\.') r;
    $$;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};