\c aad_db
SET search_path TO api_0_0_1, base_0_0_1, public;
-- POST
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- POST

CREATE OR REPLACE FUNCTION api_0_0_1.adoptee(token TEXT,form JSON)  RETURNS JSONB AS $$

    Declare _form JSONB;

    Declare result JSONB;

    Declare _chelate JSONB := '{}'::JSONB;

    Declare tmp TEXT;

BEGIN

          -- [Function: User POST]

          -- [Description: Store the original values of a user chelate]

            -- [Parameters: token TEXT,form JSON]

            -- [pk is <text-value> or guid#<value>



          set role api_guest;

          -- [A. Validate token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;

          -- [B. Verify Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') then

              -- [B.1 Fail 401 when unexpected scope is detected]

              RESET ROLE;

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if form is NULL then

              -- [B.2 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          _form := form::JSONB;



          if not(_form ? 'asset_id') or not(_form ? 'user_tk') or not(_form ? 'asset_user') then

              -- [B.3 Fail 400 when form is missing a required field]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



           -- [C. Assemble Chelate Data]

           -- [C.1 Password hash]

          -- [No Password Hashing]



          -- [C.2 User specific code]

          if CURRENT_USER = 'api_user' then /* custom code */
                _chelate := base_0_0_1.chelate('{"pk":"asset_id","sk":"const#ADOPTEE","tk":"asset_user"}'::JSONB, _form);
            -- [Stash guid for insert]
            -- tmp = set_config('request.jwt.claim.key', replace(_chelate ->> 'tk','guid#',''), true);

           end if;



          -- [D. Insert Chelate]

          result := base_0_0_1.insert(_chelate, _chelate ->> 'key');

          RESET ROLE;



          -- [Return {status,msg,insertion}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- POST
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.adoptee(TEXT,JSON) to api_user;
*/
-- GET
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- GET



CREATE OR REPLACE FUNCTION api_0_0_1.adoptee(token TEXT, form JSON, options JSON) RETURNS JSONB AS $$

    Declare _form JSONB;

    Declare result JSONB;

BEGIN

          -- [Function: User GET]

          -- [Description: Find the values of a user chelate]

          -- [Parameters: token TEXT,form JSON,options JSON]



          set role api_guest;



          -- [A. Validate Token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [B. Verify Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') then

              RESET ROLE;

              -- [B.1 Fail 401 when unexpected scope is detected]

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if form is NULL then

              -- [B.2 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          _form := form::JSONB;



          if _form ? 'pk' and _form ? 'sk' then

               -- [B.3Primary query {pk,sk}]

               _form = format('{"pk":"%s", "sk":"%s"}',_form ->> 'pk',_form ->> 'sk')::JSONB;

          elsif _form ? 'pk' and not(_form ? 'sk') then

               -- [B.4 Primary query {pk,sk:*}]

               _form = format('{"pk":"%s", "sk":"%s"}',_form ->> 'pk','*')::JSONB;

          elsif _form ? 'sk' and _form ? 'tk' then

               -- [B.5 Secondary query {sk,tk}]

               _form = format('{"sk":"%s", "tk":"%s"}',_form ->> 'sk',_form ->> 'tk')::JSONB;

          elsif _form ? 'sk' and not(_form ? 'tk') then

               -- [B.6 Secondary query {sk,tk:*}]

               _form = format('{"sk":"%s", "tk":"%s"}',_form ->> 'sk','*')::JSONB;

          elsif _form ? 'xk' and _form ? 'yk' then

               -- [B.7 Teriary query {tk,sk} aka {xk, yk}]

               _form = format('{"xk":"%s", "yk":"%s"}',_form ->> 'xk',_form ->> 'yk')::JSONB;

          elsif _form ? 'xk' and not(_form ? 'yk') then

               -- [B.8 Teriary query {tk} aka {xk}]

               _form = format('{"xk":"%s", "yk":"%s"}',_form ->> 'xk','*')::JSONB;

          elsif _form ? 'yk' and _form ? 'zk' then

               -- [B.9 Quaternary query {sk,pk} akd {yk,zk}

               _form = format('{"yk":"%s", "zk":"%s"}',_form ->> 'yk',_form ->> 'zk')::JSONB;

          elsif _form ? 'yk' and not(_form ? 'zk') then

               -- [B.10 Quaternary query {yk}

               _form = format('{"yk":"%s", "zk":"%s"}',_form ->> 'yk','*')::JSONB;

          else

              -- [B.11 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          -- [C. Assemble Chelate Data]



          if CURRENT_USER = 'api_user' then /* custom code */
                    -- no custom code

           end if;



          -- [D. Query Chelate]

          result := base_0_0_1.query(_form);

          RESET ROLE;

          -- [Return {status,msg,selection}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- GET

-- e.g., grant EXECUTE on FUNCTION
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.adoptee(TEXT,JSON,JSON) to api_user;
*/
-- DELETE
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- DELETE



CREATE OR REPLACE FUNCTION api_0_0_1.adoptee(token TEXT,pk TEXT) RETURNS JSONB AS $$

    Declare result JSONB;

    Declare _form JSONB := '{}'::JSONB;

BEGIN

          -- [Function: adoptee DELETE]

          -- [Description: remove item by primary key ]

          -- [Parameters: token TEXT,pk TEXT]



          set role api_guest;



          -- [A. Validate Token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [B. Validate Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') then

              -- [B.1 Fail 401 when unexpected token scope is detected]

              RESET ROLE;

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if pk is NULL then

              -- [B.2 Fail 400 when pk is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          -- [C. Assemble Chelate Data]



          if CURRENT_USER = 'api_user' then /* custom code */
                    if strpos(pk,'#') > 0 then
                    -- [Assume <key> is valid when # is found ... at worst, delete will end with a 404]
                    -- [Delete by pk:<key>#<value> and sk:const#USER when undefined prefix]
                    -- _form := format('{"pk":"%s", "sk":"const#ADOPTEE"}',pk)::JSONB;
                else
                    -- [Wrap pk as primary key when # is not found in pk]
                    -- [Delete by pk:username#<value> and sk:const#USER when <key># is not present]
                    _form := format('{"pk":"asset_id#%s", "sk":"const#ADOPTEE"}',pk)::JSONB;
                end if;

           end if;



          -- [D. Delete Chelate]

          result := base_0_0_1.delete(_form, result ->> 'key');

          RESET ROLE;



          -- [Return {status,msg,deletion}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- DELETE

-- e.g., grant EXECUTE on FUNCTION
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.adoptee(TEXT,TEXT) to api_user;
*/
-- PUT
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- PUT



CREATE OR REPLACE FUNCTION api_0_0_1.adoptee(token TEXT,pk TEXT,form JSON) RETURNS JSONB AS $$

    Declare _chelate JSONB := '{}'::JSONB;

    Declare _criteria JSONB := '{}'::JSONB;

    Declare _form JSONB := '{}'::JSONB;

    Declare result JSONB;



BEGIN

          -- [Function: User PUT]

          -- [Description: Change form keys. Pk, sk, tk will change when related form key change]

          -- [Parameters: token TEXT,pk JSON, form JSON]



          set role api_guest;



          -- [A. Validate token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [B. Verify Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') then

              -- [B.1 Fail 401 when unexpected scope is detected]

              RESET ROLE;

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if pk is NULL then

              -- [B.2 Fail 400 when pk is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          if form is NULL then

              -- [B.3 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          _form := form::JSONB;



          -- [C. Assemble Chelate Data]



          -- [C.1 Password hash]

          -- [No Password Hashing]



          -- [C.2 User specific code]

          if CURRENT_USER = 'api_user' then /* custom code */
                if strpos(pk,'#') > 0 then
              -- [Assume <key> is valid when # is found ... at worst, delete will end with a 404]
              -- [Delete by pk:<key>#<value> and sk:const#USER when undefined prefix]
              _criteria := format('{"pk":"%s", "sk":"const#ADOPTEE"}',pk)::JSONB;
            else
              -- [Wrap pk as primary key when # is not found in pk]
              -- [Delete by pk:username#<value> and sk:const#USER when <key># is not present]
              _criteria := format('{"pk":"asset_id#%s", "sk":"const#ADOPTEE"}',pk)::JSONB;
            end if;
            -- merget pk and sk
            _chelate := _chelate || _criteria;
            -- add the provided form
            _chelate := _chelate || format('{"form": %s}',_form)::JSONB;

           end if;



          -- [D. Update Chelate with key]

          result := base_0_0_1.update(_chelate, result ->> 'key');

          RESET ROLE;



          -- [Return {status,msg,updation}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- PUT

-- e.g., grant EXECUTE on FUNCTION
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.adoptee(TEXT,TEXT,JSON) to api_user;
*/
-- POST
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- POST

CREATE OR REPLACE FUNCTION api_0_0_1.user(token TEXT,form JSON)  RETURNS JSONB AS $$

    Declare _form JSONB;

    Declare result JSONB;

    Declare _chelate JSONB := '{}'::JSONB;

    Declare tmp TEXT;

BEGIN

          -- [Function: User POST]

          -- [Description: Store the original values of a user chelate]

            -- [Parameters: token TEXT,form JSON]

            -- [pk is <text-value> or guid#<value>



          set role api_guest;

          -- [A. Validate token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;

          -- [B. Verify Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_admin') then

              -- [B.1 Fail 401 when unexpected scope is detected]

              RESET ROLE;

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if form is NULL then

              -- [B.2 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          _form := form::JSONB;



          if not(_form ? 'username') or not(_form ? 'password') then

              -- [B.3 Fail 400 when form is missing a required field]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



           -- [C. Assemble Chelate Data]

           -- [C.1 Password hash]

          
                if _form ? 'password' then
                  _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
                end if;
                



          -- [C.2 User specific code]

          if CURRENT_USER = 'api_admin' then /* custom code */
                _chelate := base_0_0_1.chelate('{"pk":"username","sk":"const#USER","tk":"*"}'::JSONB, _form);
            -- [Stash guid for insert]
            tmp = set_config('request.jwt.claim.key', replace(_chelate ->> 'tk','guid#',''), true);

           end if;



          -- [D. Insert Chelate]

          result := base_0_0_1.insert(_chelate, _chelate ->> 'key');

          RESET ROLE;



          -- [Return {status,msg,insertion}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- POST
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,JSON) to api_admin;
*/
-- GET
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- GET



CREATE OR REPLACE FUNCTION api_0_0_1.user(token TEXT, form JSON, options JSON) RETURNS JSONB AS $$

    Declare _form JSONB;

    Declare result JSONB;

BEGIN

          -- [Function: User GET]

          -- [Description: Find the values of a user chelate]

          -- [Parameters: token TEXT,form JSON,options JSON]



          set role api_guest;



          -- [A. Validate Token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [B. Verify Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') and not(result ->> 'scope' = 'api_admin') then

              RESET ROLE;

              -- [B.1 Fail 401 when unexpected scope is detected]

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if form is NULL then

              -- [B.2 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          _form := form::JSONB;



          if _form ? 'pk' and _form ? 'sk' then

               -- [B.3Primary query {pk,sk}]

               _form = format('{"pk":"%s", "sk":"%s"}',_form ->> 'pk',_form ->> 'sk')::JSONB;

          elsif _form ? 'pk' and not(_form ? 'sk') then

               -- [B.4 Primary query {pk,sk:*}]

               _form = format('{"pk":"%s", "sk":"%s"}',_form ->> 'pk','*')::JSONB;

          elsif _form ? 'sk' and _form ? 'tk' then

               -- [B.5 Secondary query {sk,tk}]

               _form = format('{"sk":"%s", "tk":"%s"}',_form ->> 'sk',_form ->> 'tk')::JSONB;

          elsif _form ? 'sk' and not(_form ? 'tk') then

               -- [B.6 Secondary query {sk,tk:*}]

               _form = format('{"sk":"%s", "tk":"%s"}',_form ->> 'sk','*')::JSONB;

          elsif _form ? 'xk' and _form ? 'yk' then

               -- [B.7 Teriary query {tk,sk} aka {xk, yk}]

               _form = format('{"xk":"%s", "yk":"%s"}',_form ->> 'xk',_form ->> 'yk')::JSONB;

          elsif _form ? 'xk' and not(_form ? 'yk') then

               -- [B.8 Teriary query {tk} aka {xk}]

               _form = format('{"xk":"%s", "yk":"%s"}',_form ->> 'xk','*')::JSONB;

          elsif _form ? 'yk' and _form ? 'zk' then

               -- [B.9 Quaternary query {sk,pk} akd {yk,zk}

               _form = format('{"yk":"%s", "zk":"%s"}',_form ->> 'yk',_form ->> 'zk')::JSONB;

          elsif _form ? 'yk' and not(_form ? 'zk') then

               -- [B.10 Quaternary query {yk}

               _form = format('{"yk":"%s", "zk":"%s"}',_form ->> 'yk','*')::JSONB;

          else

              -- [B.11 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          -- [C. Assemble Chelate Data]



          if CURRENT_USER = 'api_user' then /* custom code */
                    -- no custom code
            elsif CURRENT_USER = 'api_admin' then /* custom code */
                    -- no custom code

           end if;



          -- [D. Query Chelate]

          result := base_0_0_1.query(_form);

          RESET ROLE;

          -- [Return {status,msg,selection}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- GET

-- e.g., grant EXECUTE on FUNCTION
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,JSON,JSON) to api_user;
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,JSON,JSON) to api_admin;
*/
-- DELETE
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- DELETE



CREATE OR REPLACE FUNCTION api_0_0_1.user(token TEXT,pk TEXT) RETURNS JSONB AS $$

    Declare result JSONB;

    Declare _form JSONB := '{}'::JSONB;

BEGIN

          -- [Function: user DELETE]

          -- [Description: remove item by primary key ]

          -- [Parameters: token TEXT,pk TEXT]



          set role api_guest;



          -- [A. Validate Token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [B. Validate Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') and not(result ->> 'scope' = 'api_admin') then

              -- [B.1 Fail 401 when unexpected token scope is detected]

              RESET ROLE;

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if pk is NULL then

              -- [B.2 Fail 400 when pk is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          -- [C. Assemble Chelate Data]



          if CURRENT_USER = 'api_user' then /* custom code */
                    if strpos(pk,'#') > 0 then
                    -- [Assume <key> is valid when # is found ... at worst, delete will end with a 404]
                    -- [Delete by pk:<key>#<value> and sk:const#USER when undefined prefix]
                    _form := format('{"pk":"%s", "sk":"const#USER"}',pk)::JSONB;
                else
                    -- [Wrap pk as primary key when # is not found in pk]
                    -- [Delete by pk:username#<value> and sk:const#USER when <key># is not present]
                    _form := format('{"pk":"username#%s", "sk":"const#USER"}',pk)::JSONB;
                end if;
            elsif CURRENT_USER = 'api_admin' then /* custom code */
                    if strpos(pk,'#') > 0 then
                    -- [Assume <key> is valid when # is found ... at worst, delete will end with a 404]
                    -- [Delete by pk:<key>#<value> and sk:const#USER when undefined prefix]
                    _form := format('{"pk":"%s", "sk":"const#USER"}',pk)::JSONB;
                else
                    -- [Wrap pk as primary key when # is not found in pk]
                    -- [Delete by pk:username#<value> and sk:const#USER when <key># is not present]
                    _form := format('{"pk":"username#%s", "sk":"const#USER"}',pk)::JSONB;
                end if;

           end if;



          -- [D. Delete Chelate]

          result := base_0_0_1.delete(_form, result ->> 'key');

          RESET ROLE;



          -- [Return {status,msg,deletion}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- DELETE

-- e.g., grant EXECUTE on FUNCTION
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,TEXT) to api_user;
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,TEXT) to api_admin;
*/
-- PUT
\c aad_db



SET search_path TO api_0_0_1, base_0_0_1, public;



-- PUT



CREATE OR REPLACE FUNCTION api_0_0_1.user(token TEXT,pk TEXT,form JSON) RETURNS JSONB AS $$

    Declare _chelate JSONB := '{}'::JSONB;

    Declare _criteria JSONB := '{}'::JSONB;

    Declare _form JSONB := '{}'::JSONB;

    Declare result JSONB;



BEGIN

          -- [Function: User PUT]

          -- [Description: Change form keys. Pk, sk, tk will change when related form key change]

          -- [Parameters: token TEXT,pk JSON, form JSON]



          set role api_guest;



          -- [A. Validate token]

          result := base_0_0_1.validate_token(token) ;

          if result is NULL then

            -- [A.1 Fail 403 When token is invalid]

            RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;

          end if;



          -- [B. Verify Parameters]

          -- eg if not(result ->> 'scope' = 'api_admin') and not(result ->> 'scope' = 'api_guest') then

          if not(result ->> 'scope' = 'api_user') and not(result ->> 'scope' = 'api_admin') then

              -- [B.1 Fail 401 when unexpected scope is detected]

              RESET ROLE;

              return '{"status":"401","msg":"Unauthorized"}'::JSONB;

          end if;



          if pk is NULL then

              -- [B.2 Fail 400 when pk is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          if form is NULL then

              -- [B.3 Fail 400 when form is NULL]

              RESET ROLE;

              return '{"status":"400","msg":"Bad Request"}'::JSONB;

          end if;



          _form := form::JSONB;



          -- [C. Assemble Chelate Data]



          -- [C.1 Password hash]

          
                if _form ? 'password' then
                  _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
                end if;
                



          -- [C.2 User specific code]

          if CURRENT_USER = 'api_user' then /* custom code */
                if strpos(pk,'#') > 0 then
              -- [Assume <key> is valid when # is found ... at worst, delete will end with a 404]
              -- [Delete by pk:<key>#<value> and sk:const#USER when undefined prefix]
              _criteria := format('{"pk":"%s", "sk":"const#USER"}',pk)::JSONB;
            else
              -- [Wrap pk as primary key when # is not found in pk]
              -- [Delete by pk:username#<value> and sk:const#USER when <key># is not present]
              _criteria := format('{"pk":"username#%s", "sk":"const#USER"}',pk)::JSONB;
            end if;
            -- merget pk and sk
            _chelate := _chelate || _criteria;
            -- add the provided form
            _chelate := _chelate || format('{"form": %s}',_form)::JSONB;
            elsif CURRENT_USER = 'api_admin' then /* custom code */
                if strpos(pk,'#') > 0 then
              -- [Assume <key> is valid when # is found ... at worst, delete will end with a 404]
              -- [Delete by pk:<key>#<value> and sk:const#USER when undefined prefix]
              _criteria := format('{"pk":"%s", "sk":"const#USER"}',pk)::JSONB;
            else
              -- [Wrap pk as primary key when # is not found in pk]
              -- [Delete by pk:username#<value> and sk:const#USER when <key># is not present]
              _criteria := format('{"pk":"username#%s", "sk":"const#USER"}',pk)::JSONB;
            end if;
            -- merget pk and sk
            _chelate := _chelate || _criteria;
            -- add the provided form
            _chelate := _chelate || format('{"form": %s}',_form)::JSONB;

           end if;



          -- [D. Update Chelate with key]

          result := base_0_0_1.update(_chelate, result ->> 'key');

          RESET ROLE;



          -- [Return {status,msg,updation}]

          return result;

END;

$$ LANGUAGE plpgsql;

-- PUT

-- e.g., grant EXECUTE on FUNCTION
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,TEXT,JSON) to api_user;
grant EXECUTE on FUNCTION api_0_0_1.user(TEXT,TEXT,JSON) to api_admin;
*/