'use strict';
const Comment = require('../../lib/runner/comment.js');

const CreateExtension = require('../db/extension_create.js');
const CreateTableTest = require('./table_create_test.js');

const CreateFunctionChangedKeyTest = require('./function_create_changed_key_test.js'); 
const CreateFunctionChelateTest = require('./function_create_chelate_test.js'); 
const CreateFunctionDeleteTest = require('./function_create_delete_test.js'); 
const CreateFunctionGetJwtClaimsTest = require('./function_create_get_jwt_claims_test.js'); 
/* $lab:coverage:off$ */
const CreateFunctionGetJwtSecretTest = require('./function_create_get_jwt_secret_test.js'); 
const CreateFunctionInsertTest = require('./function_create_insert_test.js'); 
const CreateFunctionQueryTest = require('./function_create_query_test.js'); 
const CreateFunctionUpdateTest = require('./function_create_update_test.js');
/* $lab:coverage:on$ */
const CreateFunctionValidateChelateTest = require('./function_create_validate_chelate_test.js'); 
const CreateFunctionValidateCredentialsTest = require('./function_create_validate_credentials_test.js'); 
const CreateFunctionValidateFormTest = require('./function_create_validate_form_test.js'); 
const CreateFunctionValidateTokenTest = require('./function_create_validate_token_test.js'); 

module.exports = class BaseTests extends Array {
  constructor(baseVersion) {
    /* $lab:coverage:off$ */
    super();
    this.push(new Comment('-- Enable Base Testing'));
    this.push(new CreateExtension('pgtap','public'));
    
    this.push(new CreateTableTest('base', baseVersion));

    this.push(new CreateFunctionChangedKeyTest('base', baseVersion));
    this.push(new CreateFunctionChelateTest('base', baseVersion));
    this.push(new CreateFunctionDeleteTest('base', baseVersion));
    this.push(new CreateFunctionGetJwtClaimsTest('base', baseVersion));
    this.push(new CreateFunctionGetJwtSecretTest('base', baseVersion));
    this.push(new CreateFunctionInsertTest('base', baseVersion));
    this.push(new CreateFunctionQueryTest('base', baseVersion));

    this.push(new CreateFunctionUpdateTest('base', baseVersion));
    this.push(new CreateFunctionValidateChelateTest('base', baseVersion));
    this.push(new CreateFunctionValidateCredentialsTest('base', baseVersion));
    this.push(new CreateFunctionValidateFormTest('base', baseVersion));
    this.push(new CreateFunctionValidateTokenTest('base', baseVersion));
    /* $lab:coverage:on$ */

  }    
};