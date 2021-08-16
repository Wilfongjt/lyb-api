'use strict';
// const pg = require('pg');
const CreateTable = require('./table_create');
module.exports = class CreateTableProduction extends CreateTable {
  constructor() {
    super('prd');
  }   
};