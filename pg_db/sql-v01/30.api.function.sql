\c aad_db



CREATE SCHEMA if not exists api_0_0_1;



SET search_path TO api_0_0_1, base_0_0_1, public;

--------------

-- Environment

--------------





--\set lb _env `echo "'$LB _ENV'"`

--\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`

--\set lb _guest_password `echo "'$LB _GUEST_PASSWORD'"`

--\set postgres_jwt_claims `echo "'$POSTGRES_JWT_CLAIMS'"`

--\set api_scope     `echo "'$API_SCOPE'"`



--select :api_scope as api_scope;





---------------

-- GRANT: Grant Schema Permissions

---------------



grant usage on schema api_0_0_1 to api_guest;

grant usage on schema api_0_0_1 to api_user;



grant usage on schema api_0_0_1 to api_authenticator;

\c aad_db

SET search_path TO api_0_0_1, base_0_0_1, public;



--=============================================================================

-- TIME

--=============================================================================



/*

 _______ _

|__   __(_)

   | |   _ _ __ ___   ___

   | |  | | '_ ` _ \ / _ \

   | |  | | | | | | |  __/

   |_|  |_|_| |_| |_|\___|







*/





CREATE OR REPLACE FUNCTION api_0_0_1.time() RETURNS JSONB

AS $$

  declare _time timestamp;

  declare _zone TEXT;

BEGIN

  SELECT NOW()::timestamp into _time ;

  SELECT current_setting('TIMEZONE') into _zone;

  return format('{"status":"200", "msg":"OK", "time": "%s", "zone":"%s"}',_time,_zone)::JSONB;

END;

$$ LANGUAGE plpgsql;



grant EXECUTE on FUNCTION api_0_0_1.time() to api_guest;

grant EXECUTE on FUNCTION api_0_0_1.time() to api_user;

\c aad_db





--------------

-- Environment

--------------





--\set lb _env `echo "'$LB _ENV'"`

--\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`

--\set lb _guest_password `echo "'$LB _GUEST_PASSWORD'"`

--\set postgres_jwt_claims `echo "'$postgres_jwt_claims'"`

--\set api_scope     `echo "'$API_SCOPE'"`



--select :api_scope as api_scope;



---------------

-- SCHEMA: Create Schema

---------------

--CREATE SCHEMA if not exists api_0_0_1;





--------------

-- DATABASE: Alter app.settings

--------------

--ALTER DATABASE aad_db SET "app.settings.jwt_secret" TO :postgres_jwt_secret;



-- doenst work ALTER DATABASE aad_db SET "custom.authenticator_secret" TO 'mysecretpassword';

--------------

-- SETTINGS

--------------

-- settings are only available at runtime

-- settings are not avalable for use in this script



--ALTER DATABASE aad_db SET "app.lb _env" To :lb _env;



--ALTER DATABASE aad_db SET "app.lb_woden" To :lb_woden;



--ALTER DATABASE aad_db SET "app.lb_guest_one" To '{"role":"guest_one"}';



--ALTER DATABASE aad_db SET "app.lb_editor_one" To '{"role":"editor_one", "key":"afoekey012345"}';



--ALTER DATABASE aad_db SET "app.postgres_jwt_claims" To :postgres_jwt_claims;



---------------

-- GRANT: Grant Schema Permissions

---------------





--g rant usage on schema api_0_0_1 to api_guest;

--gr ant usage on schema api_0_0_1 to api_user;



--gra nt usage on schema api_0_0_1 to api_authenticator;



---------------

-- SCHEMA: Set Schema Path

---------------



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

/*

connect (api_authenticator)

          |

          + --->  [signin(TEXT,JSON)]

                      |

switch              (api_guest)

                      |

step                [is_valid_token(guest_token, 'api_guest')]

                      |

step                [authenticate]

                      |

step                [tokenize credentials]

                      |

switch              (api_authenticator)

                      |

return              {user_token}





connection

role

-----------

SIGNIN

(api_authenticator) --> [signin(guest_token TEXT, credentials JSON)] --> (api_guest) --> {user_token}

                                    |                 |

                          token ----+                 |

                                                      |

                          credentials                 |

                            {username:"",             |

                             password:""}-------------+

*/



CREATE OR REPLACE FUNCTION api_0_0_1.signin(guest_token TEXT,credentials JSON) RETURNS JSONB

  AS $$

    Declare _credentials JSONB; -- {"username":"","password"}

    Declare _user_token TEXT;

  BEGIN

    -- [Function: Signin given token and credentials]

    -- [Description: Get a user token given the users credentials]

    -- expect user to be connected as api_authenticator

    -- [Parameter: Credentials is {"username":"user@user.com","password":"<password>"} ]

    set role api_guest;

    -- [Validate Token]

    if not(base_0_0_1.is_valid_token(guest_token, 'api_guest') ) then

    -- [Fail 403 when token is invalid]

      RESET ROLE;

      return '{"status":"403","msg":"Forbidden","extra":"invalid token"}'::JSONB;

    end if;

    -- [Switch Role]

    set role api_guest; -- api_authenticator allows this switch but doesnt dictate it

    -- [Validate Credentials]

    _credentials := base_0_0_1.validate_credentials(credentials::JSONB);

    if _credentials is NULL then

      -- [Fail 400 when credentials are NULL or missing]

      RESET ROLE;

      return '{"status":"400","msg":"Bad Request"}'::JSONB;

    end if;



    --_credentials := _credentials || '{"scope":"api_user"}';



    _user_token := NULL;



    BEGIN

      -- [Verify User Credentials]

      -- [Generate user token]



          SELECT public.sign(row_to_json(r), current_setting('app.settings.jwt_secret')) AS token into _user_token

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



      -- evaluate results

      if _user_token is NULL then

        -- [Fail 404 when User Credentials are not found]

        RESET ROLE;

        _credentials := _credentials || '{"password":"********"}'::JSONB;

        return format('{"status":"404","msg":"Not Found","credentials":%s}',_credentials)::JSONB;

      end if;

    EXCEPTION

            when others then

              RESET ROLE;

              RAISE NOTICE 'Insert Beyond here there be dragons! %', sqlstate;

              return format('{"status":"%s", "msg":"Unhandled"}', sqlstate)::JSONB;

    END;

    RESET ROLE;

    -- calculate the token

    -- [Return {status,msg,token}]

    return format('{"status":"200","msg":"OK","token":"%s"}',_user_token)::JSONB;



  END;

$$ LANGUAGE plpgsql;

-- GRANT: Grant Execute



grant EXECUTE on FUNCTION api_0_0_1.signin(TEXT, JSON) to api_authenticator;

\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



/*

User (TEXT, TEXT, JSON) - INSERT

  _____ _             _    _

 / ____(_)           | |  | |

| (___  _  __ _ _ __ | |  | |_ __

 \___ \| |/ _` | '_ \| |  | | '_ \

 ____) | | (_| | | | | |__| | |_) |

|_____/|_|\__, |_| |_|\____/| .__/

           __/ |            | |

          |___/             |_|



connect (api_authenticator)

          |

          + --->  [signup(TEXT,JSON)]

                      |

switch              (api_guest)

                      |

step                [is_valid_token(guest_token, 'guest')]

                      |

step                [authenticate]

                      |

step                [tokenize credentials]

                      |

switch              (api_authenticator)

                      |

return              {user_token}





INSERT

(api_authenticator)---> signup(token TEXT, form JSON) --> (token.scope) ---> insert(JSON) --> (insertion)

                                 |           |

                  api_token -----+           |

                                             |

                  form {username:"",         |

                        displayname:"",      |

                        password:""} --------+



Insert User  token, {username:<value>,

                     displayname:<value>,

                     password:<value>}



*/

-- INSERT

CREATE OR REPLACE FUNCTION api_0_0_1.signup(token TEXT,form JSON, key TEXT default '0')  RETURNS JSONB AS $$

    Declare _form JSONB; Declare result JSONB; Declare chelate JSONB := '{}'::JSONB;Declare tmp TEXT;



        BEGIN

          -- [Function: Signup given guest_token TEXT, form JSON]

          -- [Description: Add a new user]

          -- [Switch to Role]

          -- [Switch to api_guest Role]

          set role api_guest;



          -- [Validate Token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [Verify token has expected scope]

          if not(result ->> 'scope' = 'api_guest') then

              -- [Fail 401 when unexpected scope is detected]

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;

          -- [Validate form parameter]

          if form is NULL then

              -- [Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;

          -- [Validate Form with user's credentials]

          _form := form::JSONB;



          -- [Validate Requred form fields]

          if not(_form ? 'username') or not(_form ? 'password') then

              -- [Fail 400 when form is missing requrired field]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;

          -- [Hash password when found]

          if _form ? 'password' then

              --_form := (_chelate ->> 'form')::JSONB;

              _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;

          end if;

          -- [Assign Scope]

          _form := _form || format('{"scope":"%s"}','api_user')::JSONB;

          --raise notice 'signup _form %', _form;

          -- [Overide the token's default role]

          set role api_user;



          -- [Assemble Data]

          if CURRENT_USER = 'api_user' then

              if key = '0' then

                  -- [Generate owner key when not provided]

                  chelate := base_0_0_1.chelate('{"pk":"username","sk":"const#USER","tk":"*"}'::JSONB, _form); -- chelate with keys on insert

              else

                if position('#' in key) < 1 then

                    -- [Concat guid to when not 0 and no # is found]

                    key := format('guid#%s',key);

                end if;



                  -- [Overide owner when signup key provided]

                  chelate := base_0_0_1.chelate(format('{"pk":"username","sk":"const#USER","tk":"%s"}', key)::JSONB, _form); -- chelate with keys on insert



              end if;



          end if;



          -- [Stash guid for insert]

          tmp = set_config('request.jwt.claim.key', chelate ->> 'tk', true); -- If is_local is true, the new value will only apply for the current transaction.

          -- [Execute insert]

          chelate := chelate || format('{"owner":"%s"}', chelate ->> 'tk')::JSONB;

          result := base_0_0_1.insert(chelate,chelate ->> 'owner');



          RESET ROLE;

          -- [Return {status,msg,insertion}]

          return result;

        END;

        $$ LANGUAGE plpgsql;



grant EXECUTE on FUNCTION api_0_0_1.signup(TEXT,JSON,TEXT) to api_guest;
