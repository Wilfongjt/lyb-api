'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSignin extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    this.baseKind = 'base';
    this.baseVersion = baseVersion;
    this.name = 'signin';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(guest_token TEXT,credentials JSON) RETURNS JSONB

    AS $$
  
      Declare _credentials JSONB; -- {"username":"","password"}
  
      Declare _user_token TEXT;
  
      Declare _token JSONB;
      Declare _expected_scope TEXT := 'api_user';
  
    BEGIN
      -- [Function: Signin given token and credentials]
      -- [Description: Get a user token given the users credentials]
      -- expect user to be connected as api_authenticator
      -- [Parameter: Credentials is {"username":"user@user.com","password":"<password>"} ]
      -- not supported under Hobby
      -- set role api_ guest;
  
      -- [Validate Token]
      _token = ${this.baseKind}_${this.baseVersion}.validate_token(guest_token, 'api_guest');
  
      --if not(${this.baseKind}_${this.baseVersion}.is_valid _token(guest_token, 'api_guest') ) then
      if _token is NULL then 
        -- [Fail 403 when token is invalid]
        --RESET ROLE; -- not hobby friendly 
        return '{"status":"403","msg":"Forbidden","extra":"invalid token"}'::JSONB;
      end if;
  
      -- [Switch Role]
      -- not supported under Hobby
      --set role api_ guest; -- api_authenticator allows this switch but doesnt dictate it
      -- [Validate Credentials]
  
      _credentials := ${this.baseKind}_${this.baseVersion}.validate_credentials(credentials::JSONB);
  
      if _credentials is NULL then
        -- [Fail 400 when credentials are NULL or missing]
        --RESET ROLE; -- not hobby friendly 
        return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
  
      _credentials := _credentials || format('{"scope":"%s"}', _expected_scope)::JSONB;
  
      _user_token := NULL;
  
      BEGIN
        -- [Verify User Credentials]
        -- [Generate user token]
            --           SELECT public.sign(row_to_json(r), ${this.baseKind}_${this.baseVersion}.get_jwt_secret(),) AS token into _user_token
  
            SELECT ${this.baseKind}_${this.baseVersion}.sign(row_to_json(r), ${this.baseKind}_${this.baseVersion}.get_jwt_secret()) AS token into _user_token
                 FROM (
                   SELECT
                     _token ->> 'aud' as aud,
                     _token ->> 'iss' as iss,
                     _token ->> 'sub' as sub,
                     _credentials ->> 'username' as user,
                     _credentials ->> 'scope' as scope,
                     pk as jti,
                     tk as key
                   from ${this.baseKind}_${this.baseVersion}.one
                   where
                       LOWER(pk) = LOWER(format('username#%s', _credentials ->> 'username'))
                       and sk = 'const#USER'
                       and form ->> 'password' = crypt(_credentials ->> 'password', form ->> 'password')
                 ) r;
        -- evaluate results
        if _user_token is NULL then
          -- [Fail 404 when User Credentials are not found]
          --RESET ROLE; -- not hobby friendly 
          _credentials := _credentials || '{"password":"********"}'::JSONB;
          return format('{"status":"404","msg":"Not Found","extra":"null token","credentials":%s}',_credentials)::JSONB;
        end if;
      EXCEPTION
              when others then
                --RESET ROLE; -- not hobby friendly 
                RAISE NOTICE 'Insert Beyond here there be dragons! %', sqlstate;
                return format('{"status":"%s", "msg":"Unhandled"}', sqlstate)::JSONB;
      END;
      --RESET ROLE; -- not hobby friendly 
      -- calculate the token
      -- [Return {status,msg,token}]
      return format('{"status":"200","msg":"OK","token":"%s"}',_user_token)::JSONB;
  
    END;
  
  $$ LANGUAGE plpgsql;
  
  -- GRANT: Grant Execute
  
  /* Doesnt work in Hobby
  
  grant EXECUTE on FUNCTION ${this.name}(TEXT, JSON) to api_authenticator;
  */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};