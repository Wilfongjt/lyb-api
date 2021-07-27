-- Not hobby friendly
\c pg_db

SET search_path TO base_0_0_1, public;

-- Should deprecate replace with validate_token
CREATE OR REPLACE FUNCTION base_0_0_1.is_valid_token(_token TEXT, expected_role TEXT) RETURNS BOOLEAN
  AS $$
    DECLARE good Boolean;
    DECLARE tx TEXT;
    DECLARE valid_user JSONB;
    DECLARE _step TEXT;
  BEGIN
    -- [Function: Validate Token given token and expected scope]
    -- is token null
    -- does role in token match expected role
    -- use db parameter app.settings.jwt_secret
    -- event the token
    -- Non-Hobby _token is a string with an actual token
    -- Hobby _token is a string containing a json object ... postgres_jwt_claims  
    -- return true/false
    --raise notice 'is_valid_ token %',_token;
    _step := 'is_valid_ token 1';
    if _token is NULL
      or expected_role is NULL
    then
      -- [False when token or scope is NULL]
      return false;
    end if;
    _step := 'is_valid_ token 2';

    good:=false;
    BEGIN
     --raise notice '_token %', _token;
     --raise notice 'current user %', current_user;
     -- [Remove Bearer prefix on token]
    _step := 'is_valid_ token 3';

     _token := replace(_token,'Bearer ','');
    _step := 'is_valid_ token 4';
     -- Not hobby friendly 
     -- [Hobby cant use current_setting]
     -- [Hobby cant use set_config]
	   valid_user := to_jsonb(base_0_0_1.verify(_token, base_0_0_1.get_jwt_secret(),'HS256' ))::JSONB;
     
     -- work around for Hobby
     -- valid_user := _token::JSONB; 
     _step := 'is_valid_ token 5';
    EXCEPTION
      when sqlstate '42883' then
        RAISE NOTICE 'is_valid_ token has UNDEFINED FUNCTION 42883 %', _step;
        RETURN false;
      when sqlstate '22P02' then 
        RAISE NOTICE 'is_valid_ token has invalid_text_representation sqlstate 22P02 %', _token;
        RETURN false;
      when sqlstate '22021' then
        RAISE NOTICE 'is_valid_ token has character_not_in_repertoire sqlstate %', sqlstate;
        RETURN false;
      when others then
        RAISE NOTICE 'is_valid_ token has unhandled sqlstate %', sqlstate;
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
        -- Not Hobby friendly, set_config
        --Deprecated tx := set_config('request.jwt.claim. user', (valid_user ->> 'payload')::JSONB ->> 'user', true); -- If is_local is true, the new value will only apply for the current transaction.
        --Deprecatedtx := set_config('request.jwt.claim. scope', (valid_user ->> 'payload')::JSONB ->> 'scope', true); -- If is_local is true, the new value will only apply for the current transaction.
        --Deprecatedtx := set_config('request.jwt.claim. key', (valid_user ->> 'payload')::JSONB ->> 'key', true); -- If is_local is true, the new value will only apply for the current transaction.
    end if;
    
    -- [Return Boolean]
    RETURN good;
  END;  $$ LANGUAGE plpgsql;

/* Not Hobby friendly
  grant EXECUTE on FUNCTION base_0_0_1.is_valid_ token(TEXT, TEXT) to api_guest;

  grant EXECUTE on FUNCTION base_0_0_1.is_valid_ token(TEXT, TEXT) to api_user;

  grant EXECUTE on FUNCTION base_0_0_1.is_valid_ token(TEXT, TEXT) to api_admin;
*/
