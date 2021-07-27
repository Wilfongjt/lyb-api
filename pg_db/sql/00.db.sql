\c postgres

-- Heroku autmatically creates a database
SELECT 'CREATE DATABASE pg_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pg_db')\gexec

--------------
-- Environment: Read environment variables
--------------


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

\c pg_db

----------------
-- Extentions
-- Dont work in Hobby 
--------------
   
CREATE EXTENSION IF NOT EXISTS pgtap;





