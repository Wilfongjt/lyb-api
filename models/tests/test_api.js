'use strict';

const Comment = require('../../lib/runner/comment.js'); 
const CreateExtension = require('../db/extension_create.js');
const CreateFunctionSigninTest = require('./function_create_signin_test.js'); 
const CreateFunctionSignupTest = require('./function_create_signup_test.js'); 
// const apiVersion = '0_0_1';
// const baseVersion = '0_0_1';
module.exports = class ApiTests extends Array {
  constructor(apiVersion, baseVersion) {
    /* $lab:coverage:off$ */
    super();
    this.push(new Comment('-- Enable Api Testing'));
    this.push(new CreateExtension('pgtap','public'));
    this.push(new CreateFunctionSignupTest('api', apiVersion, baseVersion));
    this.push(new CreateFunctionSigninTest('api', apiVersion, baseVersion));
    /* $lab:coverage:on$ */
  }    
};