\c pg_db;

SET search_path TO api_0_0_1, base_0_0_1, public;

/*
     _             _
    (_)           (_)
 ___ _  __ _ _ __  _ _ __
/ __| |/ _` | '_ \| | '_ \
\__ \ | (_| | | | | | | | |
|___/_|\__, |_| |_|_|_| |_|
        __/ |
       |___/
*/



BEGIN;

  \set jwt_claims_guest  base_0_0_1.get_jwt_claims('''guest''','''api_guest''','''0''')

  \set jwt_secret  base_0_0_1.get_jwt_secret()
  \set guest_token base_0_0_1.sign(:jwt_claims_guest::JSON, :jwt_secret::TEXT)::TEXT


  select api_0_0_1.signup(

    :guest_token,

    '{"username":"signin@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

  );



  SELECT plan(8);

  -- 1

  SELECT has_function(

      'api_0_0_1',

      'signin',

      ARRAY[ 'TEXT', 'JSON' ],

      'Function signin (text, json) should exist'

  );

  -- 2

  SELECT is (

    api_0_0_1.signin(

      NULL::TEXT,

      NULL::JSON

    )::JSONB ->> 'msg',

    'Forbidden'::TEXT,

    'signin NO token, NO credentials, Forbidden 0_0_1'::TEXT

  );

    -- 3

  SELECT is (

    api_0_0_1.signin(

      'bad.token.jjj'::TEXT,

      NULL::JSON

    )::JSONB ->> 'msg',

    'Forbidden'::TEXT,

    'signin token BAD, NO credentials, Forbidden 0_0_1'::TEXT

  );

  -- 4

  SELECT is (

    api_0_0_1.signin(

      NULL::TEXT,

      '{"username":"signin@user.com",

        "password":"a1A!aaaa"

       }'::JSON)::JSONB - 'extra',

    '{"msg": "Forbidden", "status": "403"}'::JSONB,

    'signin NO token, GOOD credentials,  Forbidden 403 0_0_1'::TEXT

  );

  -- 5

  SELECT is (

    api_0_0_1.signin(
      :guest_token,

      '{"username":"unknown@user.com","password":"a1A!aaaa"}'::JSON

    )::JSONB - '{"extra","credentials"}'::TEXT[],
    '{"msg":"Not Found","status":"404"}'::JSONB,

    'signin GOOD token Bad Username Credentials 0_0_1'::TEXT

  );



  -- 6

  SELECT is (

    api_0_0_1.signin(

      :guest_token,

      '{"username":"signin@user.com","password":"unknown"}'::JSON

      )::JSONB - '{"extra","credentials"}'::TEXT[],

      '{"msg": "Not Found", "status": "404"}'::JSONB,

      'signin GOOD token BAD Password Credentials 404 0_0_1'::TEXT

  );

  -- 7

  SELECT is (

    (api_0_0_1.signin(

      :guest_token,

      '{"username":"signin@user.com","password":"a1A!aaaa"}'::JSON

    )::JSONB || '{"token":"********"}'),

    '{"msg": "OK", "token": "********", "status": "200"}'::JSONB,

    'signin GOOD token GOOD Credentials 200 0_0_1'::TEXT

  );

  SELECT * FROM finish();

ROLLBACK;