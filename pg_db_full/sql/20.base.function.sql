\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;



--=======================================

-- Changed_key

--=======================================



CREATE OR REPLACE FUNCTION base_0_0_1.changed_key(chelate JSONB) RETURNS BOOLEAN

AS $$

	declare _rec record;

	declare _form JSONB;

	declare _value TEXT;

	declare _fld TEXT;

BEGIN

  -- [Function: Changed_Key]

  -- [Description: determines if one of the keys has been changed ]

  -- [Updates are done on primary key]

	-- Change when "tk" key not found



  _form := chelate ->> 'form';

  --   if not(chelate ? 'tk') or not(chelate ? 'pk') then



  if not(chelate ? 'pk') or not(chelate ? 'sk') then

    -- [Assume changed When chelate is missing pk and sk]

    -- unable to detect change to tk when not in chelate

    -- assume changed

    -- let the .update(chelate) function fix it

    return true;

  end if;

  -- evaluate form key

  -- [Detect change by comparing Chelate.Key.Value to Chelate.form keys and values]

  -- [Form to Key Transform is {name:A} to {k:name#A}]

	-- [Key to Form Tranform is {k:name#A to name:A}]

	-- No change is {pk:name#A,     form:{name:A}}

  --                       |                 |

  --                       +--- no change ---+

  -- Change is {{pk:name#A} form:{name:B}}

  --                     |             |

  --                     +--- change --+



	FOR _rec IN Select * from jsonb_each_text(_form)

  LOOP

    -- [usernname:a@b.com ---> usernname#a@b.com]

    _value := format('%s#%s',_rec.key, _rec.value) ; --> usernname#a@b.com

    _fld := format('%s#',_rec.key); --> usernname#

    --

    if strpos(chelate ->> 'pk', _fld) = 1 then -- starts with usernname#

  		if chelate ->> 'pk' != _value then -- no match then changed

  			return true;

  	  end if;

  	elsif strpos(chelate ->> 'sk', _fld) = 1 then

  		if chelate ->> 'sk' != _value then

  			return true;

  	  end if;

  	--elsif strpos(chelate ->> 'tk', _fld) = 1 then

  	--	if chelate ->> 'tk' != _value then

  	--		return true;

    --  end if;

    end if;

  END LOOP;

  -- [Return Boolean]

  return false;

END;

$$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
grant EXECUTE on FUNCTION base_0_0_1.changed_key(JSONB) to api_user;
*/
\c aad_db

SET search_path TO base_0_0_1, base_0_0_1, public;



--=======================================

-- Chelate

--=======================================

-- keys

-- NULL,NULL

-- 'xss', NULL

-- '',''

-- {bad}

/*

  CONST is        "const#<ALLCAPS>"

                     |  |  |

     identifier  --- +  |  |

     seperator -------- +  |

     specifier ------------+



  GUID is         "guid#<guid>"

                    |  |  |

    identifier  --- +  |  |

    seperator -------- +  |

    specifier ------------+



  Date: 202106

  key is "const" || "guid" || <field-name>

  compound is     "<key1>#<value1>+<key2>#<value2>"

                    |    |  |     |  |   |  |

    identifier  --- +    |  |     |  |   |  |

    seperator ---------- +  |     |  |   |  |

    value ------------------+     |  |   |  |

    seperator2 ------------------ +  |   |  |

    identifier ----------------------+   |  |

    seperator ---------------------------+  |

    value ----------------------------------+

*/



CREATE OR REPLACE FUNCTION base_0_0_1.chelate(expected_keys JSONB, form JSONB) RETURNS JSONB

AS $$

  Declare _rc JSONB := '{}'::JSONB;

  Declare _rec record;

  Declare _key TEXT;

  DECLARE _fld TEXT;

  Declare i integer := 0;

BEGIN

  -- [Function: Chelate]

  -- [Description: Build a Chelate given a list of expected keys and a form]

  -- construct {form:{},pk:"", sk:"", tk:""}

  -- user with client.insert

  -- make a chelate from expected_keys and form

  -- expected_keys eg {"pk":"username","sk":"const#USER", "tk":"*"}

  -- expected_keys eg {"pk":"asset_id+user_key","sk":"const#USER", "tk":"*"}

  -- check incomming values

  -- Validate expected_keys and form]

  if expected_keys is NULL or form is NULL then

    -- [Fail NULL when expected_keys or form is NULL]

    return NULL;

  end if;

  -- keys

  -- Build Chelate keys from form values]

  FOR _rec IN SELECT * FROM jsonb_each_text(expected_keys)

    LOOP

       _key := _rec.key;

       _fld := _rec.value; -- value is a field name



       if form ? _fld then

          -- Handle Simple Value as {<key-name>:<form.field-name>#<form.field-value>}]

          -- [Handle Simple Value]

          _rc := _rc || format('{"%s":"%s#%s"}',_key, _fld, form ->> _fld)::JSONB;



       elsif strpos(_fld, 'const#') = 1 then

          -- Handle Constant as {<key-name>:const#<constant-value>}]

          -- [Handle Constant ... passthrough]

          _rc := _rc || format('{"%s":"%s"}',_key, _fld)::JSONB;

       elsif strpos(_fld, 'guid#') = 1 then

          -- Handle GUID as {<key-name>:guid#<guid-value>}]

          -- [Handle GUID...passthrough, guid is defined, so pass it through]

          _rc := _rc || format('{"%s":"%s"}',_key, _fld)::JSONB;

       elsif _fld = '*' then

          -- Handle Wildcard as {<key-name>:guid#<generated-guid-value>}]

          -- [Handle Wildcard...generate guid]

          _rc := _rc || format('{"%s":"guid#%s"}',_key, uuid_generate_v4())::JSONB;

       else -- not found

          -- [Fail NULL When expected key is not found in form]

          return NULL;

       end if;

       i = 1;

    END LOOP;



    if i = 0 then

      -- [Fail NULL When expected key object is {}]

      return NULL;

    end if;



    _rc := _rc || format('{"form":%s}',form::TEXT)::JSONB;

  -- [Return {pk,sk,tk,form:{key1:value, key2:value2,...}}]

  return _rc;



END;

$$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
grant EXECUTE on FUNCTION base_0_0_1.chelate(JSONB,JSONB) to api_user;
*/


CREATE OR REPLACE FUNCTION base_0_0_1.chelate(chelate JSONB) RETURNS JSONB

AS $$

 DECLARE _rec record;

 DECLARE _fld TEXT;

 DECLARE _form jsonb;

 DECLARE _value TEXT;

 DECLARE _key TEXT;

 DECLARE _out JSONB;

BEGIN



--



-- creates proposed chelate to update



-- "created" is added on insert, it will be in the record and doesnt need to be added

-- "updated" is changed everytime

--   GUID never changes

_form := chelate ->> 'form';

-- UPDATED date

_out := format('{"updated": "%s"}', NOW());



-- get outter keys of chelate

FOR _rec IN SELECT * FROM jsonb_each_text(chelate)

LOOP

  _key := _rec.key;

  _fld := split_part(_rec.value, '#', 1);



  if _key = 'form' then

     -- copy the whole form att

     _out := _out || format('{"form": %s}', _form::TEXT)::JSONB;

  elsif  _form ->> _fld is NULL then -- key not in form

     -- is a constant, a guid, created, keep the current value

    if not(_fld = 'updated') then -- skip updated field

       _out := _out || format('{"%s":"%s"}', _key, chelate ->> _key)::JSONB;

    end if;

  else

     -- this is a key

    _out := _out || format('{"%s":"%s#%s"}', _key, _fld, _form ->> _fld)::JSONB;



  end if;

END LOOP;



return _out;



END;

$$ LANGUAGE plpgsql;




/* Doesnt work in Hobby
GRANT EXECUTE on FUNCTION base_0_0_1.chelate(JSONB) to api_user;
*/
\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;





/*

 ______               _     _

|  ____|             | |   | |

| |____   _____ _ __ | |_  | |     ___   __ _  __ _  ___ _ __

|  __\ \ / / _ \ '_ \| __| | |    / _ \ / _` |/ _` |/ _ \ '__|

| |___\ V /  __/ | | | |_  | |___| (_) | (_| | (_| |  __/ |

|______\_/ \___|_| |_|\__| |______\___/ \__, |\__, |\___|_|

                                        __/ | __/ |

                                       |___/ |___/





*/



-----------------

-- FUNCTION: Create event_logger(_form JSONB)

-----------------



CREATE OR REPLACE FUNCTION base_0_0_1.event_logger(form JSONB) RETURNS JSONB

AS $$

  Declare rc jsonb;

  Declare _model_user JSONB;

  Declare _form JSONB;

  Declare _jwt_role TEXT;

  Declare _validation JSONB;

  Declare _password TEXT;



  BEGIN

    -- [Function: event_logger]

    _form := form;

    _validation := base_0_0_1.event_logger_validate(_form);

    if _validation ->> 'status' != '200' then

        return _validation;

    end if;



    if _form ? 'id' then

        return '{"status": "400", "msg": "Update not supported"}'::JSONB;

    else



      BEGIN

              INSERT INTO base_0_0_1.one

                  (sk, tk, form)

              VALUES

                  ('event',_form ->> 'type', _form);

      EXCEPTION

          WHEN unique_violation THEN

              return '{"status":"400", "msg":"Bad event Request, duplicate error"}'::JSONB;

          WHEN check_violation then

              return '{"status":"400", "msg":"Bad event Request, validation error"}'::JSONB;

          WHEN others then

              return format('{"status":"500", "msg":"Unknown event insertion error", "SQLSTATE":"%s"}',SQLSTATE)::JSONB;

      END;

    end if;



    rc := '{"msg": "OK", "status": "200"}'::JSONB;

    return rc;

  END;

$$ LANGUAGE plpgsql;

\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;



-- GRANT: Grant Execute



-----------------

-- FUNCTION: Create event_logger_validate(form JSONB)

-----------------



CREATE OR REPLACE FUNCTION base_0_0_1.event_logger_validate(form JSONB) RETURNS JSONB

AS $$



  BEGIN

    -- [Function: event_logger_validate]

    if not(form ? 'type' ) then

       return '{"status":"400","msg":"Bad Request, event_logger_validate is missing one or more form attributes"}'::JSONB;

    end if;

    if form ? 'password'  then

       return '{"status":"409","msg":"Conflict, password should not be included."}'::JSONB;

    end if;

    return '{"status": "200"}'::JSONB;

  END;

$$ LANGUAGE plpgsql;

-- GRANT: Grant Execute
/* Doesnt work in Hobby
grant EXECUTE on FUNCTION base_0_0_1.event_logger_validate(JSONB) to event_logger_role; -- upsert

--grant EXECUTE on FUNCTION base_0_0_1.event_logger_validate(JSONB) to editor_one; -- upsert
*/
\c aad_db



SET search_path TO base_0_0_1, public;



CREATE OR REPLACE FUNCTION base_0_0_1.is_valid_token(_token TEXT, expected_role TEXT) RETURNS BOOLEAN

  AS $$



    DECLARE good Boolean;

    DECLARE tx TEXT;

    DECLARE valid_user JSONB;



  BEGIN

    -- [Function: Validate Token given token and expected scope]

    -- is token null

    -- does role in token match expected role

    -- use db parameter app.settings.jwt_secret

    -- event the token

    -- return true/false

    --raise notice 'is_valid_token %',_token;

    if _token is NULL

      or expected_role is NULL

    then

      -- [False when token or scope is NULL]

      return false;

    end if;



    good:=false;

    BEGIN

     --raise notice '_token %', _token;

     --raise notice 'current user %', current_user;

     -- [Remove Bearer prefix on token]

     _token := replace(_token,'Bearer ','');

	   valid_user := to_jsonb(verify(_token,current_setting('app.settings.jwt_secret'),'HS256' ))::JSONB;



    EXCEPTION

      when sqlstate '22021' then

        RAISE NOTICE 'character_not_in_repertoire sqlstate %', sqlstate;

        RETURN false;

      when others then

        RAISE NOTICE 'is_valid_token has unhandled sqlstate %', sqlstate;

        RETURN false;

    END;

    -- [False when scope isnt verified]

    -- [Scope may contain more than one comma delemeted role]

    if strpos((valid_user ->> 'payload')::JSONB ->> 'scope', expected_role) > 0 then

    --if (valid_user ->> 'payload')::JSONB ->> 'scope' = expected_role then

      good := true;

        -- [Set user in session]

        -- [Set scope in session]

        -- [Set user key in session]

        tx := set_config('request.jwt.claim.user', (valid_user ->> 'payload')::JSONB ->> 'user', true); -- If is_local is true, the new value will only apply for the current transaction.

        tx := set_config('request.jwt.claim.scope', (valid_user ->> 'payload')::JSONB ->> 'scope', true); -- If is_local is true, the new value will only apply for the current transaction.

        tx := set_config('request.jwt.claim.key', (valid_user ->> 'payload')::JSONB ->> 'key', true); -- If is_local is true, the new value will only apply for the current transaction.

    end if;

    -- [Return Boolean]

    RETURN good;

  END;  $$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
  grant EXECUTE on FUNCTION base_0_0_1.is_valid_token(TEXT, TEXT) to api_guest;

  grant EXECUTE on FUNCTION base_0_0_1.is_valid_token(TEXT, TEXT) to api_user;

  grant EXECUTE on FUNCTION base_0_0_1.is_valid_token(TEXT, TEXT) to api_admin;
*/
\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;

CREATE OR REPLACE FUNCTION base_0_0_1.validate_chelate(chelate JSONB, expected TEXT) RETURNS JSONB

    AS $$

      Declare state TEXT;

    BEGIN

      -- [Function: Validate Chelate given Chelate and Expected Value]

      -- On Sucess, return

      -- On Failure, return reason

      if chelate is NULL or expected is NULL then

        -- [False when Chelate or Expected is NULL]

        return NULL;

      end if;

      -- [Check for existance of pk,sk,tk,form,owner,active,created, and updated]

      state := '';

      if chelate ? 'pk' then state := state ||'P'::TEXT; else state := state || 'p'; end if;

      if chelate ? 'sk' then state := state || 'S'; else state := state || 's'; end if;

      if chelate ? 'tk' then state := state || 'T'; else state := state || 't'; end if;

      if chelate ? 'form' then state := state || 'F'; else state := state || 'f'; end if;

      if chelate ? 'owner' then state := state || 'O';  else state := state || 'o'; end if;

      if chelate ? 'active' then state := state || 'A'; else state := state || 'a'; end if;

      if chelate ? 'created' then state := state || 'C'; else state := state || 'c'; end if;

      if chelate ? 'updated' then state := state || 'U'; else state := state || 'u'; end if;



      if not(state = expected) then

        -- [Exit with NULL when evaluation does not match expected]

        return NULL;

      end if;

      -- [Return chelate when evaluation matches expected]

  	  return chelate;

    END;

  $$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
grant EXECUTE on FUNCTION base_0_0_1.validate_chelate(JSONB, TEXT) to api_guest;

grant EXECUTE on FUNCTION base_0_0_1.validate_chelate(JSONB, TEXT) to api_user;
*/
\c aad_db



SET search_path TO base_0_0_1, public;







CREATE OR REPLACE FUNCTION base_0_0_1.validate_credentials(credentials JSONB) RETURNS JSONB

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
    grant EXECUTE on FUNCTION base_0_0_1.validate_credentials(JSONB) to api_user;

--    grant EXECUTE on FUNCTION base_0_0_1.validate_credentials(JSONB) to api_guest;
*/
\c aad_db



SET search_path TO  base_0_0_1, public;





CREATE OR REPLACE FUNCTION base_0_0_1.validate_criteria(criteria JSONB) RETURNS JSONB

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
  grant EXECUTE on FUNCTION base_0_0_1.validate_criteria(JSONB) to api_user;

  --  grant EXECUTE on FUNCTION base_0_0_1.validate_criteria(JSONB) to api_guest;
*/
\c aad_db



SET search_path TO base_0_0_1, public;



CREATE OR REPLACE FUNCTION base_0_0_1.validate_form(required_form_keys TEXT[], form JSONB) RETURNS JSONB

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
/* Doesnt work in Hobby
    grant EXECUTE on FUNCTION base_0_0_1.validate_form(TEXT[],JSONB) to api_guest;
*/
\c aad_db



SET search_path TO base_0_0_1, public;



CREATE OR REPLACE FUNCTION base_0_0_1.validate_token(_token TEXT) RETURNS JSONB

  AS $$



    DECLARE valid_user JSONB;

    DECLARE tx TEXT;



  BEGIN

    -- [Function: Validate Token]

    -- [Description: Validate Token given token and expected scope]

    -- is token null

    -- does role in token match expected role

    -- use db parameter app.settings.jwt_secret

    -- event the token

    -- return true/false

    --raise notice 'is_valid_token %',_token;

    if _token is NULL then

      -- [False when token or scope is NULL]

      return NULL;

    end if;



    BEGIN



	    valid_user := to_jsonb(verify(replace(_token,'Bearer ',''),current_setting('app.settings.jwt_secret'),'HS256' ))::JSONB;



      if not((valid_user ->> 'valid')::BOOLEAN) then

        return NULL;

      end if;



      valid_user := (valid_user ->> 'payload')::JSONB;



      -- [Ensure token payload has user and scope claims]

      if not(valid_user ? 'scope') or not(valid_user ? 'user')  then

      	return NULL;

      end if;



      -- [Set user in session]

      -- [Set scope in session]

      -- [Set user key in session]

      tx := set_config('request.jwt.claim.user', valid_user ->> 'user', true); -- If is_local is true, the new value will only apply for the current transaction.

      tx := set_config('request.jwt.claim.scope', valid_user ->> 'scope', true); -- If is_local is true, the new value will only apply for the current transaction.

      tx := set_config('request.jwt.claim.key', valid_user ->> 'key', true); -- If is_local is true, the new value will only apply for the current transaction.

      -- [Set role to token scope]

      Execute(format('set role %s',(valid_user ->> 'scope')));



    EXCEPTION

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

  grant EXECUTE on FUNCTION base_0_0_1.validate_token(TEXT) to api_guest;

  --grant EXECUTE on FUNCTION base_0_0_1.validate_token(TEXT,TEXT) to api_user;
*/
/*

CREATE OR REPLACE FUNCTION base_0_0_1.validate_token(_token TEXT,expected TEXT) RETURNS JSONB

  AS $$



    DECLARE valid_user JSONB;

    DECLARE tx TEXT;



  BEGIN

    -- Validate Token]

    -- Description: Validate Token given token and expected scope]

    -- is token null

    -- does role in token match expected role

    -- use db parameter app.settings.jwt_secret

    -- event the token

    -- return true/false

    --raise notice 'is_valid_token %',_token;

    if _token is NULL then

      -- False when token or scope is NULL]

      return NULL;

    end if;



    BEGIN



	    valid_user := to_jsonb(verify(_token,current_setting('app.settings.jwt_secret'),'HS256' ))::JSONB;



      if not((valid_user ->> 'valid')::BOOLEAN) then

        return NULL;

      end if;



      valid_user := (valid_user ->> 'payload')::JSONB;



      -- Ensure token payload has user and scope claims]

      if not(valid_user ? 'scope') or not(valid_user ? 'user')  then

      	return NULL;

      end if;





      -- Set user in session]

      -- Set scope in session]

      -- Set user key in session]

      tx := set_config('request.jwt.claim.user', valid_user ->> 'user', true); -- If is_local is true, the new value will only apply for the current transaction.

      tx := set_config('request.jwt.claim.scope', valid_user ->> 'scope', true); -- If is_local is true, the new value will only apply for the current transaction.

      tx := set_config('request.jwt.claim.key', valid_user ->> 'key', true); -- If is_local is true, the new value will only apply for the current transaction.

      -- Set role to token scope]

      Execute(format('set role %s',(valid_user ->> 'scope')));



    EXCEPTION

        when sqlstate '22021' then

          RAISE NOTICE 'character_not_in_repertoire sqlstate %', sqlstate;

          RETURN NULL;

        when others then

          RAISE NOTICE 'validate_token has unhandled sqlstate %', sqlstate;

          RETURN NULL;

    END;

    -- False when scope isnt verified]



    -- Return token claims]

    RETURN valid_user;

  END;  $$ LANGUAGE plpgsql;



  grant EXECUTE on FUNCTION base_0_0_1.validate_token(TEXT,TEXT) to api_guest;





*/

\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;





--=============================================================================

-- DELETE

--=============================================================================





-- Delete

--  _____       _      _

-- |  __ \     | |    | |

-- | |  | | ___| | ___| |_ ___

-- | |  | |/ _ \ |/ _ \ __/ _ \

-- | |__| |  __/ |  __/ ||  __/

-- |_____/ \___|_|\___|\__\___|



-- {pk,sk}

-- ToDo: limit delete to users personal records.



CREATE OR REPLACE FUNCTION base_0_0_1.delete(criteria JSONB, owner_ TEXT) RETURNS JSONB

AS $$

  --declare _crit JSONB;

  declare _result record;

  declare _status TEXT;

  declare _msg TEXT;

  declare _rc JSONB;

  BEGIN

    -- [Function: Delete by Primary Criteria {pk,sk}]

    -- [Description: Delete User by primary key {pk,sk}]

    -- [Validate Criteria]

      criteria := base_0_0_1.validate_criteria(criteria);



      if criteria is NULL then

      -- [Fail 400 when a criteria parameter is NULL]

        return '{"status":"400","msg":"Bad Request"}'::JSONB;

      end if;



      --if not(criteria ? 'pk') or  not(criteria ? 'sk') then -- {pk sk}

      --  -- [Fail 400 when criteria is missing pk or sk]

      --  return format('{"status":"400", "msg":"Bad Request", "criteria":%s}',criteria)::JSONB ;

      --end if;



      BEGIN

          --_crit := criteria::JSONB;

          -- there can be only one

          if criteria ? 'pk' and criteria ? 'sk' and criteria ->> 'sk' = '*' then



              -- [Delete where pk and sk]

              Delete from base_0_0_1.one

                where lower(pk)=lower(criteria ->> 'pk') and owner=owner_

                returning * into _result;



          elsif criteria ? 'pk' and criteria ? 'sk' then



            -- [Delete where pk and sk]

              Delete from base_0_0_1.one

                where lower(pk)=lower(criteria ->> 'pk')

                      and sk=criteria ->> 'sk'

                      and owner=owner_

                returning * into _result;



          elsif criteria ? 'sk' and criteria ? 'tk' then



            Delete from base_0_0_1.one

              where sk=criteria ->> 'sk' and tk=criteria ->> 'tk'

              and owner=owner_

              returning * into _result;

          else



              return format('{"status":"400", "msg":"Bad Request", "criteria":%s}',criteria)::JSONB ;

          end if;

          -- [Remove password from results when found]



          _rc :=  to_jsonb(_result)  #- '{form,password}';



          if _rc ->> 'pk' is NULL then

            -- [Fail 404 when primary key is not found]

            -- [Fail 404 when item is not owned by current]

            return format('{"status":"404", "msg":"Not Found", "owner":"%s", "criteria":%s}', owner_, criteria)::JSONB ;

          end if;



      EXCEPTION



          when others then

            RAISE NOTICE '5 Beyond here there be dragons! %', sqlstate;

            return format('{"status":"%s", "msg":"Internal Server Error", "criteria":%s}',sqlstate,criteria)::JSONB ;

      END;



      -- [Return {status,msg,criteria,deletion}]

      return format('{"status":"200", "msg":"OK", "criteria":%s, "deletion":%s}',criteria,_rc::TEXT)::JSONB ;

  END;

  $$ LANGUAGE plpgsql;



-- GRANT: Grant Execute


/* Doesnt work in Hobby
grant EXECUTE on FUNCTION base_0_0_1.delete(JSONB,TEXT) to api_user;
*/
\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;





--=============================================================================

-- INSERT

--=============================================================================

-- returns {}



-- Insert

--  _____                     _

-- |_   _|                   | |

--   | |  _ __  ___  ___ _ __| |_

--   | | | '_ \/ __|/ _ \ '__| __|

-- _ | |_| | | \__ \  __/ |  | |_

-- |_____|_| |_|___/\___|_|   \__|

-- {pk, sk, tk}

-- {pk, sk}

-- {sk, tk}



-- todo: add user id to inserted record ... :""

-- insert

--



CREATE OR REPLACE FUNCTION base_0_0_1.insert(_chelate JSONB,key TEXT) RETURNS JSONB

AS $$

  --declare _chelate JSONB;

  declare _form JSONB;

  declare _result record;

  declare _extra TEXT;

  --declare _scope TEXT; -- soft role

  --declare key TEXT; -- who is inserting this record

BEGIN

  -- [Function: Insert Chelate like {pk,sk,tk,form}, {pk,sk,form}, {sk,tk,form}, or {sk,form}]

  -- [Validate Chelate]

  if _chelate is NULL then

    -- [Fail 400 when a parameter is NULL]

    return '{"status":"400","msg":"Bad Request"}'::JSONB;

  end if;

  BEGIN

      --_scope := COALESCE(current_setting('request.jwt.claim.scope','t'), 'guest');

      -- [Add owner to chelate]

      -- key := COALESCE(current_setting('request.jwt.claim.key','t'), current_user);

      -- set_config('request.jwt.claim.key',guid); -- with a guid# prefix

      -- key := COALESCE(current_setting('request.jwt.claim.key','t'), '0');

      --raise notice 'insert request.jwt.claim.key %',current_setting('request.jwt.claim.key','t');

      -- [figure out who the owner is]

      --key := COALESCE(current_setting('request.jwt.claim.key','t'), '0');

      key := COALESCE(key, '0');



      --Raise Notice 'owner %', key;



      _form := (_chelate ->> 'form')::JSONB;

      --_form := _form || format('{"owner":"%s"}',key)::JSONB;

    	  -- insert

      -- !form

      if key = '0' then

        -- [Insert requires an owner key value]

        return '{"status":"400", "msg":"Bad Request", "extra":"chelate is missing owner."}'::JSONB;

      end if;

      if not(_chelate ? 'form') then -- MISSING FORM

        -- [Fail 400 when chelate is missig a form]

        return '{"status":"400", "msg":"Bad Request", "extra":"chelate is missing form."}'::JSONB;

      end if;

      -- pksktk

      -- [Insert Unique Chelate]

      if _chelate ? 'pk' and _chelate ? 'sk' and _chelate ? 'tk' then

        -- [Handle chelate with pk, sk and tk]

        _extra := 'A';

        insert into base_0_0_1.one (pk,sk,tk,form,owner)

          values (lower(_chelate ->> 'pk'), (_chelate ->> 'sk'), (_chelate ->> 'tk'), _form, key)

          returning * into _result;

        --raise notice 'A insert form %',_form;

      -- pksk

      elsif _chelate ? 'pk' and _chelate ? 'sk' then

        -- [Handle chelate with pk and sk]

        _extra := 'B';

        insert into base_0_0_1.one (pk,sk,form,owner)

          values (lower(_chelate ->> 'pk'), (_chelate ->> 'sk') ,_form, key)

          returning * into _result;

        --raise notice 'B insert form %',_form;



      -- sktk

      elsif _chelate ? 'sk' and _chelate ? 'tk' then

        -- [Handle chelate with sk and tk]

        _extra := 'C';

        insert into base_0_0_1.one (sk,tk,form,owner)

          values ((_chelate ->> 'sk'), (_chelate ->> 'tk') ,_form, key)

          returning * into _result;

        --raise notice 'C insert form %',_form;



      -- sk

      elsif _chelate ? 'sk' then

        -- [Handle chelate with sk]

        _extra := 'D';

        insert into base_0_0_1.one (sk,form,owner)

          values (

                  (_chelate ->> 'sk'),

                  _form, key) returning * into _result;

        --raise notice 'D insert form %',_form;



      else

        -- [Fail 400 when chelate is missing a proper set of keys (pk,sk,tk),(pk,sk),(sk,tk), or (sk)]

        return '{"status":"400", "msg":"Bad Request", "extra":"failed insert"}'::JSONB;

      end if;

          --raise notice 'insert 3';



    EXCEPTION

         -- when sqlstate 'PT400' then

         --   return '{"status":"400", "msg":"Bad Request"}'::JSONB;

          when unique_violation then

            -- [Fail 409 when duplicate]

            return '{"status":"409", "msg":"Duplicate"}'::JSONB;

          when others then

            RAISE NOTICE 'Insert Beyond here there be dragons! %', sqlstate;

            return format('{"status":"%s", "msg":"Unhandled","extra":"%s","owner":"%s","chelate":%s}', sqlstate, _extra,key,_chelate)::JSONB;

    END;

    -- [Return {status,msg,insertion}]

    --raise notice '[Remove the password from Insert response!]';

    return format('{"status":"200", "msg":"OK", "insertion": %s}',(to_jsonb(_result)#- '{form,password}')::TEXT)::JSONB;

    --return format('{"status":"200", "msg":"OK", "insertion": %s}',to_jsonb(_result)::TEXT)::JSONB;



END;

$$ LANGUAGE plpgsql;

/* Doesnt work in Hobby

--grant EXECUTE on FUNCTION base_0_0_1.insert(JSONB) to api_guest;

grant EXECUTE on FUNCTION base_0_0_1.insert(JSONB,TEXT) to api_user;
*/
\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;



--=============================================================================

-- QUERY

--=============================================================================



-- Query

--   ____

--  / __  \

-- | |  | |_   _  ___ _ __ _   _

-- | |  | | | | |/ _ \ '__| | | |

-- | |__| | |_| |  __/ |  | |_| |

--  \___\_\\__,_|\___|_|   \__, |

--                          __/ |

--                         |___/





CREATE OR REPLACE FUNCTION base_0_0_1.query(criteria JSONB) RETURNS JSONB

AS $$

  --declare _criteria JSONB;

  declare _result JSONB;

BEGIN

  -- [Function: Query by Criteria like {pk,sk},{sk,tk}, or {xk,yk}]

  -- [Description: General search]

	-- select by pk and sk

	-- or sk and tk

	-- use wildcard * in any position

	-- criteria is {pk:"", sk:""} or {sk:"", tk:""} or {xk:"", yk:""}



  -- [Validate parameters (criteria)]

  if criteria is NULL then

    -- [Fail 400 when a parameter is NULL]

    return '{"status":"400","msg":"Bad Request"}'::JSONB;

  end if;



	BEGIN



    -- [Note sk, tk, yk key may contain wildcards *]

    -- [Remove password when found]

    if criteria ? 'pk' and criteria ? 'sk' and criteria ->> 'sk' = '*' then

      -- [Query where criteria is {pk, sk:*}]

      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result

        FROM base_0_0_1.one u

        where pk = lower(criteria ->> 'pk');



    elsif criteria ? 'pk' and criteria ? 'sk' then

      -- [Query where criteria is {pk, sk}]

      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result

        FROM base_0_0_1.one u

        where pk = lower(criteria ->> 'pk')  and sk = criteria ->> 'sk';



    elsif criteria ? 'sk' and criteria ? 'tk' and criteria ->> 'tk' = '*' then

      -- [Query where criteria is {sk, tk:*}]

      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result

        FROM base_0_0_1.one u

        where sk = criteria ->> 'sk';



    elsif criteria ? 'sk' and criteria ? 'tk' then

      -- [Query where criteria is {sk, tk}]

      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result

        FROM base_0_0_1.one u

        where sk = criteria ->> 'sk' and tk = criteria ->> 'tk';



    elsif criteria ? 'xk' and criteria ? 'yk' and criteria ->> 'yk' = '*'  then

      -- [Query where criteria is {xk,yk:*}]

      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result

        FROM base_0_0_1.one u

        where tk = criteria ->> 'xk';



    elsif criteria ? 'xk' and criteria ? 'yk' then

      -- [Query where criteria is {xk, yk}]

      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result

        FROM base_0_0_1.one u

        where tk = criteria ->> 'xk' and sk = criteria ->> 'yk';



    else

      -- [Fail 400 when the Search Pattern is missing expected Keys]

      return format('{"status:"400","msg":"Bad Request", "extra":"A%s"}',sqlstate)::JSONB;

    end if;



  EXCEPTION

    	when others then

        --Raise Notice 'query EXCEPTION out';

        return format('{"status":"400","msg":"Bad Request", "extra":"%s"}',sqlstate)::JSONB;

	END;



  if _result is NULL then

    -- [Fail 404 when query results are empty]

    return format('{"status":"404","msg":"Not Found","criteria":%s}', criteria)::JSONB;

  end if;



  -- [Return {status,msg,selection}]

  return format('{"status":"200", "msg":"OK", "selection":%s}', _result)::JSONB;



END;

$$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
--grant EXECUTE on FUNCTION base_0_0_1.query(JSONB) to api_guest;

grant EXECUTE on FUNCTION base_0_0_1.query(JSONB) to api_user;

grant EXECUTE on FUNCTION base_0_0_1.query(JSONB) to api_admin;
*/
\c aad_db



SET search_path TO base_0_0_1, base_0_0_1, public;



  --=======================================

  -- Update

  --=======================================





-- Update

--  _    _           _       _

-- | |  | |         | |     | |

-- | |  | |_ __   __| | __ _| |_ ___

-- | |  | | '_ \ / _` |/ _` | __/ _ \

-- | |__| | |_) | (_| | (_| | ||  __/

--  \____/| .__/ \__,_|\__,_|\__\___|

--        | |

--        |_|



  -- Handles

  --   No change

  --   Form Change only (no key change)

  --   Single Key Change only

  --   Key Change with Form change

  --   GUID never changes





  CREATE OR REPLACE FUNCTION base_0_0_1.update(chelate JSONB,key TEXT) RETURNS JSONB

    AS $$

      --declare _chelate JSONB;

      declare old_chelate JSONB;

      declare new_chelate JSONB;

      DECLARE v_RowCountInt  Int;

      declare _result record;

      --DECLARE new_form JSONB;

    BEGIN

      -- [Function: Update with Chelate like {pk,sk,form}]

      -- [Description: General update]

      -- have to merge chelate.form with existing chelate

      -- handles partial chelate pk,sk, form (no tk)

      -- retrieves chelate from table with pk and sk

      -- needs to detect tk only changes

        --_chelate := chelate::JSONB;

        -- primary key update only

        -- form must be provided

        -- [Validate Parameter (chelate)]

        if chelate is NULL then

          -- [Fail 400 when a parameter is NULL]

          return '{"status":"400","msg":"Bad Request", "extra":"A"}'::JSONB;

        end if;





        if not(chelate ? 'pk'

                and chelate ? 'sk'

                and chelate ? 'form') then

           -- [Fail 400 when pk, sk or form are missing ]

           return '{"status":"400", "msg":"Bad Request", "extra":"B"}'::JSONB;

        end if;



        -- detect a key change



        if base_0_0_1.changed_key(chelate) then

          -- [Delete old chelate and insert new when keys change]

          -- update keys and form

          -- Select and Merge

          -- [Get existing chelate from table when key change detected]

            SELECT to_jsonb(r) into old_chelate

              from (

               Select *

                from base_0_0_1.one

                where pk = lower(chelate ->> 'pk')

                and sk = (chelate ->> 'sk')

                and owner = key

              ) r;

          if old_chelate is NULL then

            -- [Fail 404 when chelate is not found in table]

            return format('{"status":"404", "msg":"Not Found", "extra":"C","pk":"%s","sk":"%s","key":"%s"}',lower(chelate ->> 'pk'), (chelate ->> 'sk'), key)::JSONB;

          end if;

          -- tk patch: fix up the tk when not in the chelate parameter

          if not(chelate ? 'tk') then

            -- [Patch tk from old chelate when key change detected]

            -- add old tk to new chelate

            chelate := chelate || format('{"tk":"%s"}',(old_chelate ->> 'tk'))::JSONB;

          end if;

          -- make proper record (will sort out the tk patch)

          -- [Build replacement chelate when key change detected]

          new_chelate := base_0_0_1.chelate(chelate);

          new_chelate := new_chelate || format('{"active":"%s"}',(old_chelate ->> 'active'))::JSONB;

          new_chelate := new_chelate || format('{"owner":"%s"}',(old_chelate ->> 'owner'))::JSONB;

          new_chelate := new_chelate || format('{"created":"%s"}',(old_chelate ->> 'created'))::JSONB;

          new_chelate := new_chelate || format('{"updated":"%s"}',(old_chelate ->> 'updated'))::JSONB;



          -- Delete old

          -- [Drop existing chelate when key change detected]

          Delete from base_0_0_1.one

            where pk = lower(chelate ->> 'pk')

            and sk = chelate ->> 'sk'

            and owner = key

            returning * into _result;

          -- Insert new

          -- [Insert new chelate when key change detected]

          insert into base_0_0_1.one (pk,sk,tk,form, active, owner, created, updated)

            values ((new_chelate ->> 'pk'),

                    (new_chelate ->> 'sk'),

                    (new_chelate ->> 'tk'),

                    ((to_jsonb(_result)->>'form')::JSONB || (new_chelate ->> 'form')::JSONB),

                    ((new_chelate ->> 'active')::BOOLEAN),

                    (new_chelate ->> 'owner'),

                    (new_chelate ->> 'created')::TIMESTAMP,

                    NOW()

                   )

                    returning * into _result;



        else



          -- [Update the Chelate's Form when keys are not changed]

          -- update the form only

          update base_0_0_1.one

            set

              form = form || (chelate ->> 'form')::JSONB,

              updated = NOW()

            where

              pk = lower(chelate ->> 'pk')

              and sk = (chelate ->> 'sk')

              and owner = key

              returning * into _result;



          if not(FOUND) then

             -- [Fail 404 when given chelate is not found]

             return format('{"status":"404", "msg":"Not Found", "extra":"D", "key":"%s", "pk":"%s", "sk":"%s"}',key,chelate ->> 'pk',chelate ->> 'sk')::JSONB;

          end if;



        end if;





        -- [Remove password before return]

        -- [Return {status,msg,updation}]



        return format('{"status":"200","msg":"OK","updation":%s}',(to_jsonb(_result) #- '{form,password}')::TEXT)::JSONB;



        --return format('{"status":"200","msg":"OK","updation":%s}',to_jsonb(_result)::TEXT)::JSONB;



    END;

    $$ LANGUAGE plpgsql;


/* Doesnt work in Hobby
grant EXECUTE on FUNCTION base_0_0_1.update(JSONB,TEXT) to api_user;
*/