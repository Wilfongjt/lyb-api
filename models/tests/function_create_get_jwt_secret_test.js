'use strict';

const Step = require('../../lib/runner/step');

module.exports = class CreateFunctiongetJwtSecretTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'get_jwt_secret';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;

    SELECT plan(2);
  
    SELECT has_function(
        '${this.kind}_${this.version}',
        'get_jwt_secret',
        'Function get_jwt_secret()'
    );
  
    -- 2 

    SELECT is (
  
      (length(${this.kind}_${this.version}.get_jwt_secret()::TEXT)>32),
  
      true::Boolean,
  
      'get_jwt_secret ()'::TEXT
  
    );
  
    SELECT * FROM finish();
  
  ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};