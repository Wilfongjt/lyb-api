\c pg_db
SET search_path TO base_0_0_1, public;
-- app.settings.get_jwt_claims
-- app.settings.jwt_secret
-- request.jwt.claim.key'

\c pg_db;

SET search_path TO base_0_0_1, public;

BEGIN;

  SELECT plan(2);
  --\set guest_token base_0_0_1.sign(current_setting('''app.postgres_jwt_claims''')::JSON,current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set user_token base_0_0_1.sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"signup@user.com", "scope":"api_user"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
  --\set admin_token base_0_0_1.sign((current_setting('''app.postgres_jwt_claims''')::JSONB || '''{"user":"signup@user.com", "scope":"api_admin"}'''::JSONB)::JSON, current_setting('''app.settings.jwt_secret'''))::TEXT
  
  --select :guest_token;
  --select to_jsonb(base_0_0_1.verify(replace(:guest_token,'Bearer ',''),current_setting('app.settings.jwt_secret'),'HS256' ))::JSONB;
  -- 1 v

  SELECT has_function(
      'base_0_0_1',
      'get_jwt_claims',
      ARRAY[ 'TEXT', 'TEXT', 'TEXT' ],
      'Function get_jwt_claims(user, scope, key)'
  );

  -- 2 
  
  SELECT is (

    base_0_0_1.get_jwt_claims(
      'claims@claims.com'::TEXT,
      'api_guest'::TEXT,
      '0'::TEXT
    )::JSONB,

    '{"aud": "lyttlebit-api", "iss": "lyttlebit", "key": "0", "sub": "client-api", "user": "claims@claims.com", "scope": "api_guest"}'::JSONB,

    'get_jwt_claims (user, scope, key)'::TEXT

  );
  -- 3 
  SELECT is (

    base_0_0_1.get_jwt_claims(
      'claims@claims.com'::TEXT,
      'api_user'::TEXT,
      'duckduckgoose'::TEXT
    )::JSONB,

    '{"aud": "lyttlebit-api", "iss": "lyttlebit", "key": "duckduckgoose", "sub": "client-api", "user": "claims@claims.com", "scope": "api_user"}'::JSONB,

    'get_jwt_claims (user, scope, key)'::TEXT

  );

  SELECT * FROM finish();

ROLLBACK;