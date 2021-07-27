\c pg_db
SET search_path TO base_0_0_1, public;


CREATE OR REPLACE FUNCTION base_0_0_1.get_password() RETURNS TEXT
  AS $$
    
  BEGIN

      RETURN current_setting('syslog_ident');
      -- RETURN current_setting('app.settings.jwt_secret');

  END;  $$ LANGUAGE plpgsql;