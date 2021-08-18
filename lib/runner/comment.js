'use strict';

const Step = require('../../lib/runner/step');

module.exports = class Comment extends Step {
  constructor(comment) {
    super(comment, '0_0_0');
    // [* schema_name is '<kind>_<version>' like api_0_0_1 or base_0_0_1] 
    
    this.setName(`${this.kind}_${this.version}`);
    this.sql = `CREATE SCHEMA if not exists ${this.name};`;
    
  }    
  async process(client) {

    if (!client) {
      console.log('** Step BAD CLIENT');
    }
    //console.log('sql', this.sql); 
    console.log('-- ', this.kind, '--');
    
  }

};