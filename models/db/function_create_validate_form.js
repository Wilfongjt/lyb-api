'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateForm extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'validate_form';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(required_form_keys TEXT[], form JSONB) RETURNS JSONB

    AS $$

    Declare key TEXT;

    BEGIN

      -- [Function: Validate Form given required_form_keys and form]

      -- form has at least one key

      -- form must contain all the keys in the keys required

      if required_form_keys is NULL then

        -- [NULL when required_form_keys is NULL]

        return NULL;

      end if;



      if form is NULL then

        -- [Exit NULL when form is NULL]

        return NULL;

      end if;



      FOREACH key in ARRAY required_form_keys loop

        if not(form ? key) then

          -- [Exit NULL when form is missing]

          return NULL;

        end if;

      end loop;

      -- [Return form]

      return form;



    END;

  $$ LANGUAGE plpgsql;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};