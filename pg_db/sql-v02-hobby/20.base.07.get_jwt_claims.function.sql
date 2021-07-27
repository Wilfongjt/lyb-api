\c pg_db
SET search_path TO base_0_0_1, public;
-- app.settings.get_jwt_claims
-- app.settings.jwt_secret
-- request.jwt.claim.key'


-------------
-- Gets
-------------
-- [# JWT_Claims]
/*
CREATE OR REPLACE FUNCTION base_0_0_1.get_jwt_claims() RETURNS JSONB
  AS $$
  BEGIN
      -- POSTGRES_JWT_CLAIMS
      RETURN '{"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"?", "scope":"?", "key":"?"}'::JSONB;
      -- RETURN current_setting('app.settings.jwt_claims')::JSONB;
  END;  $$ LANGUAGE plpgsql;
*/
CREATE OR REPLACE FUNCTION base_0_0_1.get_jwt_claims(user_ TEXT, scope_ TEXT, key_ TEXT) RETURNS JSONB
  AS $$
  BEGIN
      -- POSTGRES_JWT_CLAIMS
      RETURN format('{"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"%s", "scope":"%s", "key":"%s"}', user_, scope_, key_)::JSONB;
      -- RETURN current_setting('app.settings.jwt_claims')::JSONB;
  END;  $$ LANGUAGE plpgsql;


