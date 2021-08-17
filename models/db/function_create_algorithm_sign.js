'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionAlgorithmSign extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'algorithm_sign';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(signables text, secret text, algorithm text)
    RETURNS text LANGUAGE sql AS $$
    WITH
      alg AS (
        SELECT CASE
          WHEN algorithm = 'HS256' THEN 'sha256'
          WHEN algorithm = 'HS384' THEN 'sha384'
          WHEN algorithm = 'HS512' THEN 'sha512'
          ELSE '' END AS id)  -- hmac throws error
    SELECT ${this.kind}_${this.version}.url_encode(public.hmac(signables, secret, alg.id)) FROM alg;
    $$;`;
    // console.log('CreateFunction', this.sql);
  }    
};