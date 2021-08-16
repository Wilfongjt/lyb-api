'use strict';
// const pg = require('pg');
const CreateSchema = require('./schema_create.js');
module.exports = class CreateSchemaBase extends CreateSchema {
  constructor(version) {
    super('base', version);
  }
};