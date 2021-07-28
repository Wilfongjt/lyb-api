


\c pg_db;



SET search_path TO api_0_0_1, base_0_0_1, public;



/*

Delete





*/

-------------------

-- User_

------------------

--\set user_token sign((current_setting('app.postgres_jwt_claims')::JSONB || \'{"user":"delete@user.com", "scope":"api_user"}'::JSONB)::JSON, current_setting('app.settings.jwt_secret'))::TEXT

--\set guest_token sign((current_setting('app.postgres_jwt_claims')::JSONB || \'{"user":"guest", "scope":"api_guest"}'::JSONB)::JSON, current_setting('app.settings.jwt_secret'))::TEXT

--api_0_0_1.user(api_token TEXT, pk TEXT, sk TEXT)

BEGIN;

insert into base_0_0_1.one (pk,sk,form,owner) values ('username#delete@user.com', 'const#USER', '{"username":"delete@user.com","sk":"const#USER"}'::JSONB, 'queryUserKey' );



  SELECT plan(14);

  \set guest_token sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT

  \set user_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"delete@user.com", "scope":"api_user","key":"queryUserKey"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT

  \set user_token_1 sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"delete1@user.com", "scope":"api_user","key":"query1UserKey"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT

  --\set user_token_3 sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"delete2@user.com", "scope":"api_user","key":"query2"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT



  --\set admin_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"delete@user.com", "scope":"api_admin","key":"queryadmin"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT



  -- 1 Delete

  SELECT has_function(

      'api_0_0_1',

      'user',

      ARRAY[ 'TEXT', 'TEXT'],

      'Function User Delete (text, text) exists'

  );



--2  try to Delete with Null token and Null pk

  SELECT is (

    api_0_0_1.user(

      NULL::TEXT,

      NULL::TEXT

    )::JSONB,

    '{"msg": "Forbidden", "user": "postgres", "extra": "Invalid token", "status": "403"}'::JSONB,

    'A NULL token cant Delete a user 0_0_1'::TEXT

  );



  --3  try Delete with wrong token and null pk

    SELECT is (

      api_0_0_1.user(

        :guest_token,

        NULL::TEXT

      )::JSONB,

      '{"msg": "Unauthorized", "status": "401"}'::JSONB,

      'A guest_token cant Delete a user 0_0_1'::TEXT

    );



    --4  try to Delete with null pk

    SELECT is (

      api_0_0_1.user(

        :user_token,

        NULL::TEXT

      )::JSONB,

      '{"msg": "Bad Request", "status": "400"}'::JSONB,

      'A user_token cant Delete a user 0_0_1'::TEXT

    );



    --5  try to Delete with no pk value

    SELECT is (

      api_0_0_1.user(

        :user_token,

        ''::TEXT

      )::JSONB,

      '{"msg": "Not Found", "owner": "queryUserKey", "status": "404", "criteria": {"pk": "username#", "sk": "const#USER"}}'::JSONB,

      'A user_token cant Delete a blank user 0_0_1'::TEXT

    );

    --6  try to Delete with wrong token

    SELECT is (

      api_0_0_1.user(

        :user_token_1,

        'delete@user.com'::TEXT

      )::JSONB ,

      '{"msg": "Not Found", "owner": "query1UserKey", "status": "404", "criteria": {"pk": "username#delete@user.com", "sk": "const#USER"}}'::JSONB,

      'User Delete  (user-token,"delete@user.com") 404 0_0_1'::TEXT

    );

    --7  Delete OK

    SELECT is (

      (api_0_0_1.user(

        :user_token,

        'delete@user.com'::TEXT

      )::JSONB - '{criteria,deletion}'::text[]),

      '{"msg": "OK", "status": "200"}'::JSONB,

      'User Delete  (user-token,"delete@user.com") 200 0_0_1'::TEXT

    );

    -- 8  Delete Double Dip

    SELECT is (

      api_0_0_1.user(

        :user_token,

        'delete@user.com'::TEXT

      )::JSONB ->> 'status',

      '404',

      'User Delete  (user-token,"username#delete@user.com") 404 0_0_1'::TEXT

    );

    -- 9  Delete by GUID

/*

    SELECT is (

      api_0_0_1.user(

        :user_token_3,

        'guid#2720a5bd9-e669-41d4-b917-81212bc184a3'::TEXT

      )::JSONB ->> 'status',

      '404',

      'User Delete  (user-token,"guid#2720a5bd9-e669-41d4-b917-81212bc184a3") 404 0_0_1'::TEXT

    );

*/

  SELECT * FROM finish();



ROLLBACK;

\c pg_db;



SET search_path TO api_0_0_1, base_0_0_1, public;



/*

                       _                     _

                      (_)                   | |

 _   _ ___  ___ _ __   _ _ __  ___  ___ _ __| |_

| | | / __|/ _ \ '__| | | '_ \/ __|/ _ \ '__| __|

| |_| \__ \  __/ |    | | | | \__ \  __/ |  | |_

 \__,_|___/\___|_|    |_|_| |_|___/\___|_|   \__|







*/

BEGIN;



  SELECT plan(7);
  --\set guest_token public.sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT

  \set guest_token sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT

  \set user_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"inserted@user.com", "scope":"api_user"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT

  \set admin_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"inserted@user.com", "scope":"api_admin"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT



  -- insert

  -- var1 = [NULL, '',   guest_token, user_token]

  -- var2 = [NULL, NULL, NULL,        NULL]

  -- out  = [403, 403, 200, 403]



  -- Insert record for duplicate test



  -- 1 INSERT

  SELECT has_function(

      'api_0_0_1',

      'user',

      ARRAY[ 'TEXT', 'JSON' ],

      'Function User Insert (text, jsonb) exists'

  );

  -- 2 INSERT

  SELECT is (

    api_0_0_1.user(

      NULL::TEXT,

      NULL::JSON

    )::JSONB,

    '{"msg": "Forbidden", "user": "postgres", "extra": "Invalid token", "status": "403"}'::JSONB,

    'A NULL token cant be used to add a user 0_0_1'::TEXT

  );





-- 3 INSERT

SELECT is (

  api_0_0_1.user(

  :guest_token,

    NULL::JSON

  )::JSONB,

  '{"msg": "Unauthorized", "status": "401"}'::JSONB,

  'A guest_token cant add a NULL user 0_0_1'::TEXT

);

  -- 4 INSERT



  SELECT is (

    api_0_0_1.user(

      :user_token,

      NULL::JSON

    )::JSONB,

    '{"msg": "Unauthorized", "status": "401"}'::JSONB,

    'A user_token cant add a NULL user 0_0_1'::TEXT  );



  -- 5 INSERT

  SELECT is (

    api_0_0_1.user(

      :user_token,

      '{"username":"inserted@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB,

    '{"msg": "Unauthorized", "status": "401"}'::JSONB,

    'A user_token cant add new user 0_0_1'::TEXT

  );

  -- 6 INSERT

  /*

  SELECT is (

    api_0_0_1.user(

      :admin_token,

      '{"username":"inserted@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON

    )::JSONB ->> 'status',

    '200',

    'An admin_token can add new user 0_0_1'::TEXT

  );

  */



  SELECT * FROM finish();



ROLLBACK;

\c pg_db;



SET search_path TO api_0_0_1, base_0_0_1, public;



/*
                                _           _
                               | |         | |
 _   _ ___  ___ _ __   ___  ___| | ___  ___| |_
| | | / __|/ _ \ '__| / __|/ _ \ |/ _ \/ __| __|
| |_| \__ \  __/ |    \__ \  __/ |  __/ (__| |_
 \__,_|___/\___|_|    |___/\___|_|\___|\___|\__|

*/

-------------------

-- User_ins

------------------

--\set user_token sign((current_setting('app.postgres_jwt_claims')::JSONB || \'{"user":"existing@user.com", "scope":"api_user"}'::JSONB)::JSON, current_setting('app.settings.jwt_secret'))::TEXT

--\set guest_token sign((current_setting('app.postgres_jwt_claims')::JSONB || \'{"user":"guest", "scope":"api_guest"}'::JSONB)::JSON, current_setting('app.settings.jwt_secret'))::TEXT



BEGIN;

   -- [Insert test users]

  insert into base_0_0_1.one (pk,sk,form,owner) values ('username#query@user.com',  'const#USER', '{"username":"query@user.com", "sk":"const#USER"}'::JSONB, 'queryUserKey' );

  insert into base_0_0_1.one (pk,sk,form,owner) values ('username#query1@user.com', 'const#USER', '{"username":"query1@user.com","sk":"const#USER"}'::JSONB, 'query1UserKey' );

  insert into base_0_0_1.one (pk,sk,form,owner) values ('username#query2@user.com', 'const#USER', '{"username":"query2@user.com","sk":"const#USER"}'::JSONB, 'query2UserKey' );



  SELECT plan(14);

  \set guest_token sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT

  \set user_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"query@user.com", "scope":"api_user","key":"queryUserKey"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT

  \set admin_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"query@user.com", "scope":"api_admin","key":"queryUserKey"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT





  -- function

  -- query user(NULL NULL NULL)

  -- 1 query

  SELECT has_function(

      'api_0_0_1',

      'user',

      ARRAY[ 'TEXT', 'JSON', 'JSON' ],

      'Function User Query (text, json, json) exists'

  );

--2  query

  SELECT is (

    api_0_0_1.user(

      NULL::TEXT,

      NULL::JSON,

      '{}'::JSON

    )::JSONB ->> 'status' = '403',

    true::Boolean,

    'User Query  (NULL,NULL),{} 403 0_0_1'::TEXT

  );

  -- 3  query

  SELECT is (

    api_0_0_1.user(

      ''::TEXT,

      NULL::JSON,

      '{}'::JSON

    )::JSONB ->> 'status' = '403',

    true::Boolean,

    'User Query  ("",NULL) 403 0_0_1'::TEXT

  );

  -- 4   query

  SELECT is (

    api_0_0_1.user(

    'xxx'::TEXT,

      NULL::JSON,

      '{}'::JSON

    )::JSONB ->> 'status' = '403',

    true::Boolean,

    'User Query  (xxx),NULL) 403 0_0_1'::TEXT

  );

  -- 5  query

  SELECT is ( -- conn as guest, switch to guest and try query

    api_0_0_1.user(

      :guest_token,

      NULL::JSON,

      '{}'::JSON

    )::JSONB ->> 'status' = '401',

    true::Boolean,

    'User Query  (guest_token,NULL) 401 0_0_1'::TEXT

  );

  -- 6  query

  SELECT is (

    api_0_0_1.user(

      :user_token,

      NULL::JSON,

      '{}'::JSON

    )::JSONB,

    '{"msg": "Bad Request", "status": "400"}'::JSONB,

    'User Query  (user_token,NULL) Token query 400 0_0_1'::TEXT

  );



  -- 7  query

  SELECT is (

    api_0_0_1.user(

      :user_token,

      '{}'::JSON,

      '{}'::JSON

    )::JSONB,

    '{"msg": "Bad Request", "status": "400"}'::JSONB,

    'User Query  (user_token,{}) 400 0_0_1'::TEXT

  );



  -- 8  query

  SELECT is (

    api_0_0_1.user(

      :user_token,

      '{"pk":""}'::JSON,

      '{}'::JSON

    )::JSONB ,

    '{"msg": "Not Found", "status": "404", "criteria": {"pk": "", "sk": "*"}}'::JSONB,

    'User Query  (user_token,{username:""}) 400 0_0_1'::TEXT

  );



  -- 9  query

  SELECT is (

    (api_0_0_1.user(

      :user_token,

      '{"pk":"username#query@user.com","sk":"const#USER"}'::JSON,

      '{}'::JSON

    )::JSONB - 'selection'),

    '{"msg": "OK", "status": "200"}'::JSONB,

    'User Query  (user_token,{username:good}) 200 0_0_1'::TEXT

  );



  -- 10  query

  SELECT is (

    (api_0_0_1.user(

      :user_token,

      '{"pk":"username#query@user.com","sk":"*"}'::JSON,

      '{}'::JSON

    )::JSONB - 'selection'),

    '{"msg": "OK", "status": "200"}'::JSONB,

    'User Query  (user_token,{username:good}) 200 0_0_1'::TEXT

  );

  SELECT * FROM finish();

ROLLBACK;

/*
\c pg_db;

SET search_path TO api_0_0_1, base_0_0_1, public;

BEGIN;

insert into base_0_0_1.one
  (pk, sk, tk, form, owner)
  values (
      'username#update@user.com',
      'const#USER',
      'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
      '{"username":"update@user.com",
              "displayname":"J",
              "scope":"api_user",
              "password": "$2a$06$TXVF4CDfUcHXvTeOIGrEn.BSGbbCzLxMu2t8tyZimKtsBRxxyeQBK"
       }'::JSONB,
      'updateUserKey'
  );

\set guest_token sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT
\set user_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"update@user.com", "scope":"api_user","key":"updateUserKey"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
\set admin_token sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"update@user.com", "scope":"api_admin","key":"updateUserKey"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT

-- insert used only for testing

  SELECT plan(5);

  -- 1 query

  SELECT has_function(
      'api_0_0_1',
      'user',
      ARRAY[ 'TEXT', 'TEXT', 'JSON' ],
      'Function User Update (text, text, json) exists'
  );

  -- 2

  SELECT is (
    api_0_0_1.signin(
      :guest_token,
      '{"username":"update@user.com","password":"a1A!aaaa"}'::JSON
    )::JSONB ? 'token',
    true::Boolean,
    'User signin Good token, Good Credentials Returns TOKEN 0_0_1'::TEXT
  );

  --  3 Update without Key Change

  SELECT is (
    (api_0_0_1.user(
      :user_token,
      'username#update@user.com'::TEXT,
      '{"username":"update@user.com",
                "displayname":"LLL",
                "password":"a1A!aaaa"
      }'::JSON)::JSONB - 'updation'),
      '{"msg":"OK","status":"200"}'::JSONB,
      'User Update OK non key change 0_0_1'::TEXT
  );

  SELECT * FROM finish();

ROLLBACK;
*/