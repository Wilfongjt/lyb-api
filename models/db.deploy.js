'use strict'
console.log('HI');
// const process = require('process');

const SqlRunner = require('../lib/runner/runner_sql.js');
const CreateTableProduction = require('../lib/db/table_create_production.js');
const CreateTableReview = require('../lib/db/table_create_review.js');
const CreateTableStaging = require('../lib/db/table_create_staging.js');
const CreateFunctionUrlDecode = require('../lib/db/function_create_url_decode.js');
const CreateFunctionUrlEncode = require('../lib/db/function_create_url_encode.js');
const CreateFunctionAlgorithmSign = require('../lib/db/function_create_algorithm_sign.js');
const CreateFunctionSign = require('../lib/db/function_create_sign.js');
const CreateFunctionVerify = require('../lib/db/function_create_verify.js');
const CreateFunctionGetJwtSecret = require('../lib/db/function_create_get_jwt_secret.js');
const CreateFunctionGetJwtClaims = require('../lib/db/function_create_get_jwt_claims.js');

// run all scripts
// Creates have an order
// Add new or alters to end
// Make new class for alters
const sqlRunner = new SqlRunner(process.env.DATABASE_URL)
       .add(new CreateTableProduction())
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



