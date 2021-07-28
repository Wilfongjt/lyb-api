\c pg_db
SET search_path TO base_0_0_1, public;
-- app.settings.get_jwt_claims
-- app.settings.jwt_secret
-- request.jwt.claim.key'


------------
  -- Sets
------------
-- request.jwt.claim.user
-- request.jwt.claim.scope
-- request.jwt.claim.key

\c pg_db;

SET search_path TO base_0_0_1, public;

BEGIN;

  SELECT plan(2);

  --SELECT has_function(
  --    'base_0_0_1',
  --    'get_jwt_secret',
  --    ARRAY[],
  --    'Function get_jwt_secret()'
  --);

  -- 2 

  SELECT is (

    (length(base_0_0_1.get_jwt_secret()::TEXT)>32),

    true::Boolean,

    'get_jwt_secret ()'::TEXT

  );

  SELECT * FROM finish();

ROLLBACK;