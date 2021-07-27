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
-----------------------
-- roles
-- Create Role not available in Hobby
-----------------------
/*
Heroku Postgres credentials are available only to production-class plans (Standard, Premium, Private, and Shield) on Postgres 9.6 and above. Hobby-tier plans include only the default credential, which cannot create other credentials or grant permissions.
*/
-- ROLE: process_logger_role
CREATE ROLE process_logger_role nologin; -- remove when 1.2.1 is removed
-- CREATE ROLE: event_logger_role
CREATE ROLE event_logger_role nologin; -- as 1.2.1, replaces process_logger_role
--ROLE: event_logger_role nologin;
--create a user that you want to use the database as
-- ROLE: api_guest
CREATE ROLE api_guest;
-- ROLE: api_user
CREATE ROLE api_user;
CREATE ROLE api_admin;


--create the user for the web server to connect as
-- ROLE: api_authenticator

-- Set Environment variable POSTGRES_API_PASSWORD to change the default startup password

CREATE ROLE api_authenticator noinherit login password 'password';
--CREATE ROLE api_authenticator noinherit login password :postgres_api_password;
--CREATE ROLE api_authenticator noinherit login password :api_password;
--CREATE ROLE api_authenticator noinherit login password :postgres _api_user::JSONB ->> 'password';

GRANT CONNECT ON DATABASE lyb_db TO api_authenticator;
-- allow api_authenticator to switch to api_guest
-- GRANT: api_guest to api_authenticator
GRANT api_guest to api_authenticator; --this looks backwards but is correct.
GRANT api_user to api_authenticator; --this looks backwards but is correct.
GRANT api_admin to api_authenticator; --this looks backwards but is correct.
