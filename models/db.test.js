'use strict'
/* eslint-disable no-undef */

console.log('db.test');
// const process = require('process');
const Consts = require('../lib/constants/consts');
const SqlRunner = require('../lib/runner/runner_sql.js');
// const Comment = require('../lib/runner/comment.js');
//const CreateExtension = require('./db/extension_create.js');

// const TestTable = require('./db/table_create_test.js');
const BaseTests = require('./tests/test_base.js');
const ApiTests = require('./tests/test_api.js');

// run all scripts
// Creates have an order
// Add new or alters to end
// Make new class for alters
// [* set the verson ]

const baseVersion='0_0_1';
const apiVersion='0_0_1';

// CREATE SCHEMA if not exists api_0_0_1;';
// [* switch to heroku color url when available]
let DB_URL=process.env.DATABASE_URL;
const regex = new RegExp(Consts.databaseUrlPattern());
for (let env in process.env) {
  if (regex.test(env)) {
    console.log('setting ', env);
    DB_URL=process.env[env];
  }
}

// console.log('DB_URL', DB_URL);
// [* Build database]
// [* support multiple versions]
new SqlRunner(DB_URL)
  .load(new BaseTests(baseVersion))
  .load(new ApiTests(apiVersion))
  .run();



