'use strict';
// const pg = require('pg');
const CreateTable = require('./table_create');
module.exports = class CreateTableReview extends CreateTable {
  constructor() {
    super('rvw');
  }   
};