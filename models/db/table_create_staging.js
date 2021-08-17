'use strict';
// const pg = require('pg');
const CreateTable = require('./table_create');
module.exports = class CreateTableStaging extends CreateTable {
  constructor(baseVersion) {
    super('stg', baseVersion);
  }   
};