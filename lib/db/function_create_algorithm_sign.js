'use strict';
// const pg = require('pg');
const Step = require('../runner/step');
module.exports = class CreateFunctionAlgorithmSign extends Step {
  constructor() {
    super();
    // this.kind = kind;
    this.name = `algorithm_sign`;
    this.sql = `CREATE OR REPLACE FUNCTION base_0_0_1.algorithm_sign(signables text, secret text, algorithm text)
    RETURNS text LANGUAGE sql AS $$
    WITH
      alg AS (
        SELECT CASE
          WHEN algorithm = 'HS256' THEN 'sha256'
          WHEN algorithm = 'HS384' THEN 'sha384'
          WHEN algorithm = 'HS512' THEN 'sha512'
          ELSE '' END AS id)  -- hmac throws error
    SELECT base_0_0_1.url_encode(public.hmac(signables, secret, alg.id)) FROM alg;
    $$;`;
    // console.log('CreateFunction', this.sql);
  }    
};