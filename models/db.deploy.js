'use strict';
/* eslint-disable no-undef */

console.log('db.deploy');
// const process = require('process');
// const Consts = require('../lib/constants/consts');
const SqlRunner = require('../lib/runner/runner_sql.js');
const Comment = require('../lib/runner/comment.js');
const CreateExtension = require('./db/extension_create.js');
const CreateSchema = require('./db/schema_create.js');

const CreateTable = require('./db/table_create.js');

const CreateFunctionAlgorithmSign = require('./db/function_create_algorithm_sign.js');
const CreateFunctionChangedKey = require('./db/function_create_changed_key.js');
const CreateFunctionChelate = require('./db/function_create_chelate.js');
const CreateFunctionDelete = require('./db/function_create_delete.js');
const CreateFunctionGetJwtClaims = require('./db/function_create_get_jwt_claims.js');
const CreateFunctionGetJwtSecret = require('./db/function_create_get_jwt_secret.js');
const CreateFunctionInsert = require('./db/function_create_insert.js');
const CreateFunctionQuery = require('./db/function_create_query.js');
const CreateFunctionSign = require('./db/function_create_sign.js');
const CreateFunctionUpdate = require('./db/function_create_update.js');
const CreateFunctionUrlDecode = require('./db/function_create_url_decode.js');
const CreateFunctionUrlEncode = require('./db/function_create_url_encode.js');
const CreateFunctionValidateChelate = require('./db/function_create_validate_chelate.js');
const CreateFunctionValidateCredentials = require('./db/function_create_validate_credentials.js');
const CreateFunctionValidateCriteria = require('./db/function_create_validate_criteria.js');
const CreateFunctionValidateForm = require('./db/function_create_validate_form.js');
const CreateFunctionValidateToken = require('./db/function_create_validate_token.js');
const CreateFunctionVerify = require('./db/function_create_verify.js');
const CreateFunctionTime = require('./db/function_create_time.js');
const CreateFunctionSignin = require('./db/function_create_signin.js');
const CreateFunctionSignup = require('./db/function_create_signup.js');
// const TestTable = require('./db/table_create_test.js');
const BaseTests = require('./tests/test_base.js');
const ApiTests = require('./tests/test_api.js');
const DatabaseUrl = require('../lib/plugins/postgres/database_url.js');

// run all scripts
// Creates have an order
// Add new or alters to end
// Make new class for alters
// [* set the verson ]

const baseVersion='0_0_1';
const apiVersion='0_0_1';
if (!process.env.NODE_ENV) {
  // [* Stop when NODE_ENV is not available.]
  throw new Error('Improper Environment, NODE_ENV is not set!');
}

if (!process.env.JWT_SECRET) {
  console.log('process.env', process.env);
  // [* Stop when NODE_ENV is not available.]
  throw new Error('Improper Environment, POSTGRES_JWT_SECRET is not set!');
}
if (!process.env.DATABASE_URL) {
  // [* Stop when DATABASE_URL is not available.]
  throw new Error('Improper Environment, DATABASE_URL is not set!');
}
// [* Switch to heroku color url when available]
const databaseUrl = new DatabaseUrl(process);
const DB_URL = databaseUrl.db_url; 
const testable = databaseUrl.testable;
/*
if (process.env.DATABASE_URL === DB_URL) {
  // [* No testing in Heroku staging]
  // [* No testing in Heroku production]
  // [* No testing in Heroku review]
  // [* Test in local development]
  if (process.env.NODE_ENV === 'developmemt') {
    testable = true;
    console.log('Development Database Connection');
  } else {
    console.log('Production Database Connection');
  }
} else {
  console.log("Branch", process.env.HEROKU_BRANCH);
  if (process.env.HEROKU_BRANCH) {
    console.log('Review Database Connection');
  } else {
    // staging db
    console.log('Staging Database Connection');
  }
}
*/
// console.log('process.env.NODE_ENV ',process.env.NODE_ENV );
// console.log('DATABASE_URL', process.env.DATABASE_URL);
// console.log('DB_URL', DB_URL);
// console.log('testable', testable);

// [* Build database]
// [* support multiple versions]
const runner = new SqlRunner(DB_URL)
       .add(new Comment('-- Load Extensions --'))
       .add(new CreateExtension('pgcrypto','public'))
       .add(new CreateExtension('"uuid-ossp"','public'))
       .add(new Comment('-- Create Schema --'))
       .add(new CreateSchema('base', baseVersion))
       .add(new CreateSchema('api', apiVersion))
       .add(new Comment('-- Create Base Schema Table --'))
       .add(new CreateTable('base',baseVersion))
       .add(new Comment('-- Create Base Schema Functions --'))
       .add(new CreateFunctionUrlDecode('base', baseVersion))
       .add(new CreateFunctionUrlEncode('base', baseVersion))
       .add(new CreateFunctionAlgorithmSign('base', baseVersion))
       .add(new CreateFunctionChangedKey('base', baseVersion))
       .add(new CreateFunctionChelate('base', baseVersion))
       .add(new CreateFunctionDelete('base', baseVersion))
       .add(new CreateFunctionGetJwtClaims('base', baseVersion))
       .add(new CreateFunctionGetJwtSecret('base', baseVersion, process))
       .add(new CreateFunctionInsert('base', baseVersion))
       .add(new CreateFunctionQuery('base', baseVersion))
       .add(new CreateFunctionSign('base', baseVersion))
       .add(new CreateFunctionUpdate('base', baseVersion))
     
       .add(new CreateFunctionValidateChelate('base', baseVersion))
       .add(new CreateFunctionValidateCredentials('base', baseVersion))
       .add(new CreateFunctionValidateCriteria('base', baseVersion))
       .add(new CreateFunctionValidateForm('base', baseVersion))
       .add(new CreateFunctionValidateToken('base', baseVersion))
       .add(new CreateFunctionVerify('base', baseVersion))
       .add(new Comment('-- Create Api Schema Functions --'))
       .add(new CreateFunctionTime('api', apiVersion))
       .add(new CreateFunctionSignup('api', apiVersion))
       .add(new CreateFunctionSignin('api', apiVersion))
       ;
// [* Tests]
if (testable) {

    runner
      .load(new BaseTests(baseVersion))
      .load(new ApiTests(apiVersion, baseVersion));

}

runner.run();



