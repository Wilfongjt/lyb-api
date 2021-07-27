\c postgres



--------------
-- Environment: Read environment variables
--------------

--\set lb _env `echo "'$LB _ENV'"`
--\set postgres _api_user `echo "'$POSTGRES _API_USER'"`
--\set lb _guest_password `echo "'$LB _GUEST_PASSWORD'"`
--\set api_password `echo "'$API_PASSWORD'"`

\set postgres_api_password `echo "'$POSTGRES_API_PASSWORD'"`
\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`
\set postgres_jwt_claims     `echo "'$POSTGRES_JWT_CLAIMS'"`
\set api_scope     `echo "'$API_SCOPE'"`
\set owner_id 'guid#0'


select :postgres_jwt_claims as postgres_jwt_claims;
select :postgres_api_password as postgres_api_password;
select :api_scope as api_scope;



---------------
-- Security, dont let users create anything in public
---------------
-- REVOKE CREATE ON SCHEMA public FROM PUBLIC;

\c lyb_db

----------------
-- Extentions
-- works in Hobby 
--------------
-- EXTENSION: pgcrypto
-- works in HOBBY
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- EXTENSION: uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- EXTENSION: pgtap
-- 
CREATE EXTENSION IF NOT EXISTS pgtap;


-- EXTENSION: pgjwt
-- Doenst work in HOBBY
--CREATE EXTENSION IF NOT EXISTS pgjwt;




