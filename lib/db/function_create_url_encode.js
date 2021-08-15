'use strict';
// const pg = require('pg');
const Step = require('../runner/step');
module.exports = class CreateFunctionUrlEncode extends Step {
  constructor() {
    super();
    // this.kind = kind;
    this.name = `url_encode`;
    this.sql = `CREATE OR REPLACE FUNCTION base_0_0_1.url_encode(data bytea) RETURNS text LANGUAGE sql AS $$
    SELECT pg_catalog.translate(pg_catalog.encode(data, 'base64'), E'+/=\n', '-_');
    $$;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};