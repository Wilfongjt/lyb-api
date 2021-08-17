'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateTableTest extends Step {
  constructor(kind, baseVersion) {
    super(kind, baseVersion);
    this.name = `${this.kind}_${this.version}.one`;
    this.sql = `BEGIN;
    SELECT plan(3);
    SELECT has_table('${this.kind}_${this.version}', 'one', 'Table exists');
    SELECT hasnt_pk('${this.kind}_${this.version}', 'one', 'Primary key exists');
    -- TEST: Test event_logger Insert
    SELECT * FROM finish();
    ROLLBACK;
    `;
    
  }    
  


};