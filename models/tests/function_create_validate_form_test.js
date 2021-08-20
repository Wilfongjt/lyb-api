'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateFormTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'validate_form';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;
    
      SELECT plan(1);
    
      -- 1
    
      SELECT has_function(
          '${this.kind}_${this.version}',
          'validate_form',
          ARRAY[
            'TEXT[]', 
            'JSONB' 
          ],
          'Function validate_form(text[], jsonb) exists'
      );
    
      SELECT * FROM finish();
    
    
    
    ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};