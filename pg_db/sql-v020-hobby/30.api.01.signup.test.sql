\c pg_db;

SET search_path TO api_0_0_1, base_0_0_1, public;

BEGIN;

  SELECT plan(7);
  \set jwt_secret get_jwt_secret()

  \set jwt_claims_guest get_jwt_claims('''guest''','''api_guest''','''0''')
  \set jwt_claims_user get_jwt_claims('''signup@user.com''','''api_user''','''duckduckgoose''')

  \set guest_token base_0_0_1.sign(:jwt_claims_guest::JSON, :jwt_secret::TEXT)::TEXT
  --\set user_token  base_0_0_1.sign(:jwt_claims_user::JSON, :jwt_secret::TEXT)::TEXT


  --  \set guest_token public.sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set guest_token base_0_0_1.sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set user_token base_0_0_1.sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"signup@user.com", "scope":"api_user"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set admin_ token base_0_0_1.sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"signup@user.com", "scope":"api_admin"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
  
  Select :guest_token;
  --Select :user_token;
  
  -- insert
  -- var1 = [NULL, '',   guest_token, user_token]
  -- var2 = [NULL, NULL, NULL,        NULL]
  -- out  = [403, 403, 200, 403]

  -- 1 INSERT

  SELECT has_function(

      'api_0_0_1',

      'signup',

      ARRAY[ 'TEXT', 'JSON', 'TEXT' ],

      'Function Signup Insert (text, jsonb, text) exists'

  );

  -- 2

  SELECT is (

    api_0_0_1.signup(

      NULL::TEXT,

      NULL::JSON

    )::JSONB ->> 'status' = '403',

    true::Boolean,

    'Signup Insert (NULL,NULL) 403 0_0_1'::TEXT

  );

-- 3

SELECT is (
  api_0_0_1.signup(
  :guest_token,
    NULL::JSON
  )::JSONB,
  '{"msg": "Bad Request", "status": "400"}'::JSONB,
  'Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
);

  -- 4

  SELECT is (

    api_0_0_1.signup(

    :guest_token,

      NULL::JSON

    )::JSONB,

    '{"msg": "Bad Request", "status": "400"}'::JSONB,

    'Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT

  );

  -- 5

  SELECT is (

    api_0_0_1.signup(

    :guest_token,

    '{}'::JSON

    )::JSONB,

     '{"msg": "Bad Request", "status": "400"}'::JSONB,

    'Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT

  );

  -- 6

  SELECT is (

    (api_0_0_1.signup(

      :guest_token,

      '{"username":"signup@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB - 'insertion'),

    '{"msg":"OK","status":"200"}'::JSONB,

    'Signup Insert OK 200 0_0_1'::TEXT

  );

  -- 7

  SELECT is (

    (api_0_0_1.signup(

      :guest_token,

      '{"username":"signup@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB ),

    '{"msg":"Duplicate","status":"409"}'::JSONB,

    'Signup Insert duplicate 409 0_0_1'::TEXT

  );

  -- 8

  SELECT is (

    api_0_0_1.signup(

      :guest_token,

      '{"displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB,

    '{"msg":"Bad Request","status":"400"}'::JSONB,

    'Signup Insert (guest_token,{no username, displayname, password}) 400 0_0_1'::TEXT

  );

  -- 9

  SELECT is (

    api_0_0_1.signup(

      :guest_token,

      '{"username":"signup@user.com","displayname":"J"}'::JSON

    )::JSONB ->> 'status' = '400',

    true::Boolean,

    'Signup Insert (guest_token,{username,displayname}) 400 0_0_1'::TEXT

  );

  -- 10

  SELECT is (

    (api_0_0_1.signup(

      :guest_token,

      '{"username":"signup2@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB - 'insertion'),

    '{"msg":"OK","status":"200"}'::JSONB,

    'Signup Insert (guest_token,{username,displayname,password}) 200 0_0_1'::TEXT

  );

  -- 11

  SELECT is (

    (api_0_0_1.signup(

      :guest_token,

      '{"username":"signup3@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON,

      'duckduckgoose'

    )::JSONB - 'insertion'),

    '{"msg":"OK","status":"200"}'::JSONB,

    'Signup Insert (guest_token,{username,displayname,password},duckduckgoose) 200 0_0_1'::TEXT

  );

  -- 12

  SELECT is (

    api_0_0_1.signup(

      :guest_token,

      '{"username":"signup1@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB - 'insertion'::TEXT,

    '{"msg": "OK", "status": "200"}'::JSONB,

    'Signup Insert (user_token,{username,displayname,password}) 401 0_0_1'::TEXT

  );





  SELECT * FROM finish();



ROLLBACK;
