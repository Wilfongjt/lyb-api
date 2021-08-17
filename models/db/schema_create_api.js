'use strict';
// const pg = require('pg');
const CreateSchema = require('./schema_create.js');
module.exports = class CreateSchemaApi extends CreateSchema {
  constructor(version) {
    super('api', version);
  }    
};