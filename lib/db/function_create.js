'use strict';
// const pg = require('pg');
const Step = require('../runner/step');
module.exports = class CreateFunction extends Step {
  constructor(kind) {
    super();
    this.kind = kind;
    this.name = `one_${this.kind}`;
    this.sql = ``;
    console.log('CreateFunction', this.sql);
  }    
};