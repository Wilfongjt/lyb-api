'use strict'
/* eslint-disable no-undef */

console.log('db.deploy');
// const process = require('process');
const Consts = require('../lib/constants/consts');
const SqlRunner = require('../lib/runner/runner_sql.js');

const CreateExtension = require('./db/extension_create.js');
const CreateSchema = require('./db/schema_create.js');

// const CreateSchemaBase = require('./db/schema_create_base.js');
// const CreateSchemaApi = require('./db/schema_create_api.js');
// const CreateSchemaBase = require('./db/schema_create_base.js');
const CreateTable = require('./db/table_create.js');

// const CreateTableProduction = require('./db/table_create_production.js');

/*
const CreateTableReview = require('.//db/table_create_review.js');
const CreateTableStaging = require('./db/table_create_staging.js');
const CreateFunctionUrlDecode = require('./db/function_create_url_decode.js');
const CreateFunctionUrlEncode = require('./db/function_create_url_encode.js');
const CreateFunctionAlgorithmSign = require('./db/function_create_algorithm_sign.js');
const CreateFunctionSign = require('./db/function_create_sign.js');
const CreateFunctionVerify = require('./db/function_create_verify.js');
const CreateFunctionGetJwtSecret = require('./db/function_create_get_jwt_secret.js');
const CreateFunctionGetJwtClaims = require('./db/function_create_get_jwt_claims.js');
*/
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

console.log('DB_URL', DB_URL);
// [* Build database]
// [* support multiple versions]
const sqlRunner = new SqlRunner(DB_URL)
       .add(new CreateExtension('pgcrypto','public'))
       .add(new CreateExtension('"uuid-ossp"','public'))
       .add(new CreateSchema('base', baseVersion))
       .add(new CreateSchema('api', apiVersion))
       .add(new CreateTable('base',baseVersion))
       .run()
       ;
       
/*
const sqlRunner = new SqlRunner(process.env.DATABASE_URL)
       .add(new CreateTableProduction())
       .add(new CreateTableReview())
       .add(new CreateTableStaging())
       .add(new CreateFunctionUrlDecode())
       .add(new CreateFunctionUrlEncode())
       .add(new CreateFunctionAlgorithmSign())
       .add(new CreateFunctionSign())
       .add(new CreateFunctionVerify())
       .add(new CreateFunctionGetJwtSecret())
       .add(new CreateFunctionGetJwtClaims())

       .run()
       ;
*/

// connector.end();



