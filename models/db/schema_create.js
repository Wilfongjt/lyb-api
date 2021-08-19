'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');

module.exports = class CreateSchema extends Step {
  constructor(kind, version) {
    super(kind, version);
    // [* schema_name is '<kind>_<version>' like api_0_0_1 or base_0_0_1] 
    this.setName(`${this.kind}_${this.version}`);
    this.sql = `CREATE SCHEMA if not exists ${this.name};`;

  }    
};