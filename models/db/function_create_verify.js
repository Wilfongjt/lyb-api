'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSign extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'verify';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(token text, secret text, algorithm text DEFAULT 'HS256')
    RETURNS table(header json, payload json, valid boolean) LANGUAGE sql AS $$
      SELECT
        convert_from(${this.kind}_${this.version}.url_decode(r[1]), 'utf8')::json AS header,
        convert_from(${this.kind}_${this.version}.url_decode(r[2]), 'utf8')::json AS payload,
        r[3] = ${this.kind}_${this.version}.algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
      FROM regexp_split_to_array(token, '\\.') r;
    $$;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};