'use strict';
/* eslint-disable no-undef */

console.log('db.deploy');
// const process = require('process');
const Consts = require('../lib/constants/consts');
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
let testable = false;
if (process.env.DATABASE_URL === DB_URL) {
  // [* No testing in Heroku staging]
  // [* No testing in Heroku production]
  // [* No testing in Heroku review]
  // [* Test in local development]
  if (process.env.NODE_ENV === 'developmemt') {
    testable = true;
  }
}
console.log('process.env.NODE_ENV ',process.env.NODE_ENV );
// console.log('DATABASE_URL', process.env.DATABASE_URL);
console.log('DB_URL', DB_URL);
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
       .add(new CreateFunctionGetJwtSecret('base', baseVersion))
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



