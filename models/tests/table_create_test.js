'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateTableTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$ 
    super(kind, baseVersion);
    this.name = `${this.kind}_${this.version}.one`;
    this.sql = `BEGIN;
    
    SELECT plan(2);
    -- 1
    SELECT has_table('${this.kind}_${this.version}', 'one', 'Table exists');
    -- 2
    SELECT hasnt_pk('${this.kind}_${this.version}', 'one', 'Primary key exists');

    SELECT * FROM finish();
    ROLLBACK;
    `;
    // $lab:coverage:on$ 
  }    
};