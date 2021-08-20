'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');

module.exports = class CreateExtension extends Step {
  constructor(extensionName, version) {
    /* $lab:coverage:off$ */
    super(extensionName, version);
    // [* schema_name is '<kind>_<version>' like api_0_0_1 or base_0_0_1] 
    this.setName(`${extensionName}`);
    this.sql =`CREATE EXTENSION IF NOT EXISTS ${this.name};`;
    /* $lab:coverage:on$ */
    // console.log('** CreateExtension', this.name);
  }    
};