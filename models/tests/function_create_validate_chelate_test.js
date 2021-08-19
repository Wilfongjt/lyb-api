'use strict';



const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateChelateTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'validate_chelate';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `
    BEGIN;

      SELECT plan(3);

      -- 1
    
      SELECT has_function(
    
          '${this.kind}_${this.version}',
    
          'validate_chelate',
    
          ARRAY[ 'JSONB', 'TEXT' ],
    
          'Function validate_chelate(jsonb, TEXT) exists'
    
      );
      -- 2
      SELECT ok (
    
        ${this.kind}_${this.version}.validate_chelate(
    
          '{}'::JSONB,
    
          'pstfoacu'::TEXT
    
        )::JSONB is not NULL,
    
        'validate_chelate (chelate JSONB, expected TEXT) 0_0_1'::TEXT
    
      );

      --3
      SELECT ok (
    
        ${this.kind}_${this.version}.validate_chelate(
    
          '{
    
              "pk":"a#v1",
    
              "sk":"b#v2",
    
              "tk":"c#v3",
    
              "form": {
    
                "a":"v1",
    
                "b":"v2",
    
                "c":"v3",
    
                "d":"v4"
    
              }
    
            }'::JSONB,
    
            'PSTFoacu'::TEXT
    
        )::JSONB is not NULL,
    
        'validate_chelate (chelate JSONB, expected TEXT) 0_0_1'::TEXT
    
      );
    
      SELECT * FROM finish();

    ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};