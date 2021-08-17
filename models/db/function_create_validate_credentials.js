'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateCredentials extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'validate_credentials';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(credentials JSONB) RETURNS JSONB

    AS $$

    BEGIN

      -- [Function: Validate Credentials given Credentials like {username,password}]

      -- username

      -- displayname

      -- password

      if credentials is NULL then

        -- [Exit NULL when credentials are NULL]

        return NULL;

      end if ;

      if not(credentials ? 'username')

          or not(credentials ? 'password')

      then

        -- [Exit NULL when username or password is missing]

        return NULL;

      end if;

      -- [Return Credentials on success]

      return credentials;

    END;

  $$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
  grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
*/
    `;
    // console.log('CreateFunction', this.sql);
  }    
};