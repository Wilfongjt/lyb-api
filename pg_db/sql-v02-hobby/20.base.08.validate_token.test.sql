\c pg_db;

SET search_path TO base_0_0_1, public;

BEGIN;

  SELECT plan(1);
  \set jwt_secret get_jwt_secret()

  \set claims get_jwt_claims('''guest''', '''api_guest''', '''0''')
  \set guest_token base_0_0_1.sign(:claims::JSON, :jwt_secret::TEXT)

  \set jwt_claims_user get_jwt_claims('''signup@user.com''','''api_user''','''0''')
  \set user_token  base_0_0_1.sign(:jwt_claims_user::JSON, :jwt_secret::TEXT)::TEXT

  --\set guest_token base_0_0_1.sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set user_token base_0_0_1.sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"signup@user.com", "scope":"api_user","key":"duckduckgoose"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set admin_token base_0_0_1.sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"signup@user.com", "scope":"api_admin"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
  
  --select :guest_token;
  --select to_jsonb(base_0_0_1.verify(replace(:guest_token,'Bearer ',''),current_setting('app.settings.jwt_secret'),'HS256' ))::JSONB;
  
  -- 1 
select :claims;
select :jwt_secret;
select :guest_token;

  SELECT has_function(
      'base_0_0_1',
      'validate_token',
      ARRAY[ 'TEXT', 'TEXT' ],
      'Function validate_token(token)'
  );

  -- 2 validate_ token guest
  
  SELECT is (

    base_0_0_1.validate_token(
      
      :guest_token::TEXT,
      'api_guest'::TEXT

    )::JSONB,

    '{"aud": "lyttlebit-api", "iss": "lyttlebit", "key": "0", "sub": "client-api", "user": "guest", "scope": "api_guest"}'::JSONB,

    'Good token true 0_0_1'::TEXT

  );

  -- 3 validate_ token user
  
  SELECT is (

    base_0_0_1.validate_token(
      
      :user_token::TEXT,
      'api_user'::TEXT

    )::JSONB,

    '{"aud": "lyttlebit-api", "iss": "lyttlebit", "key": "0", "sub": "client-api", "user": "signup@user.com", "scope": "api_user"}'::JSONB,

    'Good token true 0_0_1'::TEXT

  );

  SELECT * FROM finish();

ROLLBACK;
