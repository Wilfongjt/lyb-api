
-- pw is weak, cant define password for JTW 
\c pg_db

SET search_path TO base_0_0_1, base_0_0_1, public;

CREATE OR REPLACE FUNCTION base_0_0_1.sign(payload json, secret text, algorithm text DEFAULT 'HS256')
RETURNS text LANGUAGE sql AS $$
WITH
  header AS (
    SELECT base_0_0_1.url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
    ),
  payload AS (
    SELECT base_0_0_1.url_encode(convert_to(payload::text, 'utf8')) AS data
    ),
  signables AS (
    SELECT header.data || '.' || payload.data AS data FROM header, payload
    )
SELECT
    signables.data || '.' ||
    base_0_0_1.algorithm_sign(signables.data, secret, algorithm) FROM signables;
$$;
