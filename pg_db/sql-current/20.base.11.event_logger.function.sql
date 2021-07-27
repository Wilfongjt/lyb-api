
\c pg_db



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

\c pg_db



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

\c pg_db



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
\c pg_db



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
\c pg_db



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
\c pg_db



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


