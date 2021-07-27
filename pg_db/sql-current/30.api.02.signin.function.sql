\c pg_db



CREATE SCHEMA if not exists api_0_0_1;



SET search_path TO api_0_0_1, base_0_0_1, public;


------------

-- FUNCTION: Create api_0_0_1.signin(token, form JSON)

------------



--   _____ _             _____          _____   ____   _____ _______
--  / ____(_)           |_   _|        |  __ \ / __ \ / ____|__   __|
-- | (___  _  __ _ _ __   | |  _ __    | |__) | |  | | (___    | |
--  \___ \| |/ _` | '_ \  | | | '_ \   |  ___/| |  | |\___ \   | |
--  ____) | | (_| | | | |_| |_| | | |  | |    | |__| |____) |  | |
-- |_____/|_|\__, |_| |_|_____|_| |_|  |_|     \____/|_____/   |_|
--          __/ |
--         |___/




CREATE OR REPLACE FUNCTION api_0_0_1.signin(guest_token TEXT,credentials JSON) RETURNS JSONB

  AS $$

    Declare _credentials JSONB; -- {"username":"","password"}

    Declare _user_token TEXT;

    Declare _token JSONB;

  BEGIN

    -- [Function: Signin given token and credentials]

    -- [Description: Get a user token given the users credentials]

    -- expect user to be connected as api_authenticator

    -- [Parameter: Credentials is {"username":"user@user.com","password":"<password>"} ]
    -- not supported under Hobby
    -- set role api_ guest;

    -- [Validate Token]
    _token = base_0_0_1.validate_token(guest_token, 'api_guest');

    --if not(base_0_0_1.is_valid _token(guest_token, 'api_guest') ) then
    if _token is NULL then 

      -- [Fail 403 when token is invalid]

      --RESET ROLE; -- not hobby friendly 

      return '{"status":"403","msg":"Forbidden","extra":"invalid token"}'::JSONB;

    end if;

    -- [Switch Role]
    -- not supported under Hobby
    --set role api_ guest; -- api_authenticator allows this switch but doesnt dictate it

    -- [Validate Credentials]

    _credentials := base_0_0_1.validate_credentials(credentials::JSONB);

    if _credentials is NULL then

      -- [Fail 400 when credentials are NULL or missing]

      --RESET ROLE; -- not hobby friendly 

      return '{"status":"400","msg":"Bad Request"}'::JSONB;

    end if;

    --_credentials := _credentials || '{"scope":"api_user"}';

    _user_token := NULL;

    BEGIN

      -- [Verify User Credentials]

      -- [Generate user token]


          --           SELECT public.sign(row_to_json(r), base_0_0_1.get_jwt_secret(),) AS token into _user_token

          SELECT sign(row_to_json(r), base_0_0_1.get_jwt_secret()) AS token into _user_token
               FROM (
                 SELECT
                   _token ->> 'aud' as aud,
                   _token ->> 'iss' as iss,
                   _token ->> 'sub' as sub,
                   form ->> 'username' as user,
                   form ->> 'scope' as scope,
                   pk as jti,
                   tk as key
                 from base_0_0_1.one
                 where
               			LOWER(pk) = LOWER(format('username#%s', _credentials ->> 'username'))
               			and sk = 'const#USER'
               			and form ->> 'password' = crypt(_credentials ->> 'password', form ->> 'password')
               ) r;
      /*
          SELECT sign(row_to_json(r), base_0_0_1.get_jwt_secret()) AS token into _user_token

               FROM (

                 SELECT

                   current_setting('app.postgres_jwt_claims')::JSONB ->> 'aud' as aud,

                   current_setting('app.postgres_jwt_claims')::JSONB ->> 'iss' as iss,

                   current_setting('app.postgres_jwt_claims')::JSONB ->> 'sub' as sub,

                   form ->> 'username' as user,

                   form ->> 'scope' as scope,

                   pk as jti,

                   tk as key

                 from base_0_0_1.one

                 where

               			LOWER(pk) = LOWER(format('username#%s', _credentials ->> 'username'))

               			and sk = 'const#USER'

               			and form ->> 'password' = crypt(_credentials ->> 'password', form ->> 'password')

               ) r;
      */


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

grant EXECUTE on FUNCTION api_0_0_1.signin(TEXT, JSON) to api_authenticator;
*/
