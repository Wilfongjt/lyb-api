'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionUrlEncode extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'url_encode';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(data bytea) RETURNS text LANGUAGE sql AS $$
    SELECT pg_catalog.translate(pg_catalog.encode(data, 'base64'), E'+/=\n', '-_');
    $$;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};