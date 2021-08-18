'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionValidateToken extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'validate_token';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(_token TEXT, expected_scope TEXT) RETURNS JSONB
      AS $$
        DECLARE valid_user JSONB;
        DECLARE tx TEXT;
        
      BEGIN
    
        -- [Function: Validate Token]
        -- [Description: Validate Token given token and expected scope]
        -- is token null
        -- Non-hobby _token is a jwt token 
        -- Hobby _token is a string containg a json object ...{payload:{}, valid:true,user:"",scope:"",key:""}. postgres_jwt_claims
        -- does role in token match expected role
        -- use db parameter app.settings.jwt_secret
        -- event the token
        -- return true/false
        --raise notice 'is_valid _token %',_token;
    
        if _token is NULL then
          -- [False when token or scope is NULL]
          return NULL;
        end if;
    
        BEGIN
          -- Non-hobby 
          valid_user := to_jsonb(${this.kind}_${this.version}.verify(replace(_token,'Bearer ',''),
                                 ${this.kind}_${this.version}.get_jwt_secret(),'HS256')
                                )::JSONB;
          
          if not((valid_user ->> 'valid')::BOOLEAN) then
            return NULL;
          end if;
    
          valid_user := (valid_user ->> 'payload')::JSONB;
    
          -- [Ensure token payload has user and scope claims]
    
          if not(valid_user ? 'scope') or not(valid_user ? 'user')  then
            return NULL;
          end if;
    
          -- [Check token for expected scope]
          
          if not((valid_user ->> 'scope')::TEXT = expected_scope) then
            return NULL;
          end if;
    
        EXCEPTION
            when sqlstate '22023' then 
              RAISE NOTICE 'invalid_parameter_value sqlstate 22023 %', sqlstate;
              RETURN NULL;
            when sqlstate '22021' then
              RAISE NOTICE 'character_not_in_repertoire sqlstate %', sqlstate;
              RETURN NULL;
            when others then
              RAISE NOTICE 'validate_token has unhandled sqlstate %', sqlstate;
              RETURN NULL;
    
        END;
    
        -- [False when scope isnt verified]
    
        -- [Return token claims]
    
        RETURN valid_user;
    
      END;  $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    
      grant EXECUTE on FUNCTION ${this.name}(TEXT) to api_guest;
    
      --grant EXECUTE on FUNCTION ${this.name}(TEXT,TEXT) to api_user;
    */
    `;
  }    
};