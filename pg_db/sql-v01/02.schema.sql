\c lyb_db

--------------
-- Environment: Read environment variables
--------------

--\set lb _env `echo "'$LB _ENV'"`
\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`
--\set postgres _api_user `echo "'$POSTGRES _API_USER'"`
--\set lb _guest_password `echo "'$LB _GUEST_PASSWORD'"`
--\set api_password `echo "'$API_PASSWORD'"`
\set postgres_api_password `echo "'$POSTGRES_API_PASSWORD'"`
\set postgres_jwt_claims     `echo "'$POSTGRES_JWT_CLAIMS'"`
\set api_scope     `echo "'$API_SCOPE'"`
\set owner_id 'guid#0'
select :postgres_jwt_claims as postgres_jwt_claims;
--select current_setting('app.postgres_jwt_claims')::JSONB ->> 'scope';
-- select :postgres _api_user as postgres _api_user;
select :postgres_api_password as postgres_api_password;
--select :api_password as api_password;
select :api_scope as api_scope;



---------------

-- SCHEMA: Create Schema
-- works in Hobby 
---------------

CREATE SCHEMA if not exists base_0_0_1;
