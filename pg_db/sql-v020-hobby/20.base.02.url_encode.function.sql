-- Not hobby friendly 
-- cant define password for JTW 
\c pg_db

SET search_path TO base_0_0_1, base_0_0_1, public;

CREATE OR REPLACE FUNCTION base_0_0_1.url_encode(data bytea) RETURNS text LANGUAGE sql AS $$
    SELECT pg_catalog.translate(pg_catalog.encode(data, 'base64'), E'+/=\n', '-_');
$$;
