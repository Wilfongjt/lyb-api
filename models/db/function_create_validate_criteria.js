'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateCriteria extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'validate_criteria';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(criteria JSONB) RETURNS JSONB

    AS $$

    BEGIN

      -- [Function: Validate Criteria given Criteria like {sk}, {pk,sk}, {sk,tk}, or {xk,yk}]

      -- sk

      -- pk sk

      -- sk pk

      -- xk yk



      if criteria is NULL then

        -- [Exit False when criteria is NULL]

      	return NULL;

      end if ;

      if not(criteria ? 'sk') then

        -- [Exit False when sk is missing]

        return NULL;

      elsif not(criteria ? 'pk') and not(criteria ? 'tk') then

        -- [Exit False when missing pk and tk]

        return NULL;

      end if;

      -- [Return Boolean]

      return criteria;

    END;

    $$ LANGUAGE plpgsql;


    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};