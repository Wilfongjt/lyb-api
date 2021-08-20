'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateCredentialsTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'validate_credentials';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;

    SELECT plan(1);
  
    -- 1
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'validate_credentials',
  
        ARRAY[ 'JSONB' ],
  
        'Function validate_credentials(jsonb) exists'
  
    );
  
    -- TEST: Test event_logger Insert
  
    SELECT * FROM finish();

  ROLLBACK;
    `;
  // $lab:coverage:on$  
  }    
};