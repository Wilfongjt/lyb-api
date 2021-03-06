\c postgres

-- DONE 0.0.0: Setup environment variables

-- DONE 0.0.0: Create Database

-- DONE 0.0.0: Create Extensions

-- DONE 0.0.0: Create Roles

---------------

-- ISSUES: Common Issues and Solutions

/*



* todo: use two functions (overload) for update and insert instead of single function

???? app(JSON) and app(TEXT, JSON)



* issue: permission denied to set role... {"hint":null,"details":null,"code":"42501","message":"permission denied to set role \"guest_one\""}

check: is schema correct in .env PGRST_DB_SCHEMA=one_version_?_?_?

check: is role correct in .env PGRST_DB_ANON_ROLE=guest_one

check: has role been granted usage on schema

check: are environment vars empty ... not empty

check: has role been granted to authenticator

Try: make a new starter-token

Try: does token have trailing or extra eol, check jwt.io and remove any trailing eol in encoded

check: have permissions on dependent functions been set

check: does the schema path include all needed schemas

check: has schema path changed...





* issue: AUTHORIZED_USER is {"hint":null,"details":null,"code":"42501","message":"permission denied to set role \"guest_one\""}

???? added insert privileges to editor_one but now gives "Not valid base64url"

try: remove any end of line characters from ???



* issue: {"message":"JWSError (JSONDecodeError \"Not valid base64url\")"}

resolution: token contains extra characters. in this case the token is wrapped in double quotes, remove quotes before using Token





* issue: ERROR:  database "lyb_db" already exists

resolution: DROP DATABASE IF EXISTS lyb_db;



* issue: "Server lacks JWT secret"

resolution: (add PGRST_JWT_SECRET to Postrest part of docker-compose)



* issue: "JWSError JWSInvalidSignature"

resoluton: make sure WODEN is set in client environment

resolution: (check the docker-compose PGRST_JWT_SECRET password value, should be same as app.settings.jwt_secret value)

resolution: (check that sign() is using the correct JWT_SECRET value)

resolution: (replace the WODEN envirnement variable called by curl)

resolution: POSTGRES_SCHEMA and PGRST_DB_SCHEMA should be the same

resolution: remove image, docker rmi reg_db

resolution: put quotes around the export WORDEN=""

try: ?payoad in trigger has to match payload in woden function?

try: set env variables out side of  client

try: reboot



* issue: "hint":"No function matches the given name and argument types. You might need to add explicit type casts.","details":null,"code":"42883","message":"function app(type => text) does not exist"

evaluation: looks like the JSONB type doesnt translate via curl. JSON object is passed as TEXT. Postgres doesnt have a method pattern that matches "app(TEXT)"

resolution: didnt work ... rewrite app(JSONB) to app(TEXT), cast the text to JSONB once passed to function.

evaluation: curl -d '{"mytype": "app","myval": "xxx"}' is interpeted as two text parameters rather than one JSON parameter

resolution: add header ... -H "Prefer: params=single-object" to curl call

read: http://postgrest.org/en/v7.0.0/



* issue:

evaluation: sign method not matching parameters. passing JSONB when should be passing JSON

resolution: update trigger to cast _form to _form::JSON for token creation



* issue:

description: status:500 when insert on table with trigger

evaluation: user must have TRIGGER  permissions on table

evaluation: user must have EXECUTE permissions on trigger functions



* issue:

unrecognized configuration parameter \"request.jwt.claim.type

evaluation: the WODEN env variable isnt set

resolution: export WODEN='paste a valid a token here'



* issue:

description: FATAL:  password authentication failed for user "authenticator"

evaluation: password changes seem to cause this

try: removing the docker images...docker rmi lyb_db



* issue:

schema \"reg_schema\" does not exist

try: docker rmi lyb_db ... didnt work

try: reboot... didnt work

try: check docker-compose.yml, change POSTGRES_SCHEMA to match

try: dropping postgres images

try: setting the tolken value ... OK



extra code

\set postgres_password `echo "'$POSTGRES_PASSWORD'"`

\set postgres_jwt_secret `echo "'$POSTGRES_JWT_SECRET'"`

\set lb _guest_password `echo "'$LB _GUEST_PASSWORD'"`



select

:postgres_password as postgres_password,

:postgres_jwt_secret as postgres_jwt_secret,

:lb _guest_password as lb _guest_password;

--:pgrst_db_uri as pgrst_db_uri;

*/



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



--------------

-- DATABASE

--------------

--Drop database if exists lyb_db ;



--do $$

--BEGIN

--if not exists(SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('lyb_db')) then

--  CREATE DATABASE lyb_db;

--end if;

--END;

--$$ LANGUAGE plpgsql;



--SELECT 'CREATE DATABASE lyb_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lyb_db')\gexec



---------------

-- Security, dont let users create anything in public

---------------

-- REVOKE CREATE ON SCHEMA public FROM PUBLIC;



\c lyb_db



-- EXTENSION: pgcrypto

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- EXTENSION: pgtap

CREATE EXTENSION IF NOT EXISTS pgtap;

-- EXTENSION: pgjwt

CREATE EXTENSION IF NOT EXISTS pgjwt;

-- EXTENSION: uuid-ossp

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


