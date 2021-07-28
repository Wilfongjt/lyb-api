-- Not hobby friendly 
--cant define password for JTW 
\c pg_db

SET search_path TO base_0_0_1, base_0_0_1, public;

CREATE OR REPLACE FUNCTION base_0_0_1.verify(token text, secret text, algorithm text DEFAULT 'HS256')
RETURNS table(header json, payload json, valid boolean) LANGUAGE sql AS $$
  SELECT
    convert_from(base_0_0_1.url_decode(r[1]), 'utf8')::json AS header,
    convert_from(base_0_0_1.url_decode(r[2]), 'utf8')::json AS payload,
    r[3] = base_0_0_1.algorithm_sign(r[1] || '.' || r[2], secret, algorithm) AS valid
  FROM regexp_split_to_array(token, '\.') r;
$$;
