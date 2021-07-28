\c pg_db

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

----------------
-- Extentions
-- works in Hobby 
--------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- EXTENSION: uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";






