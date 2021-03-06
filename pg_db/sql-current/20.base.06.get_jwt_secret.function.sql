\c pg_db
SET search_path TO base_0_0_1, public;
-- app.settings.get_jwt_claims
-- app.settings.jwt_secret
-- request.jwt.claim.key'


-- [# JWT_Secret]
CREATE OR REPLACE FUNCTION base_0_0_1.get_jwt_secret() RETURNS TEXT
  AS $$
  declare rc TEXT;
  BEGIN

      if current_setting('app.settings.jwt_secret',true) is not NULL then
         -- [* > Hobby or Docker]
         rc := current_setting('app.settings.jwt_secret',true) ;
      elsif length(current_setting('syslog_ident')) >= 32 then  
         -- [* Hobby]
         rc := current_setting('syslog_ident');
      elsif length(current_setting('syslog_ident')) < 32 then  
         -- [* Hobby]
         rc := format('%s%s%s%s%s',current_setting('app.settings.jwt_secret'),current_setting('app.settings.jwt_secret'),current_setting('app.settings.jwt_secret'),current_setting('app.settings.jwt_secret'),current_setting('app.settings.jwt_secret'));                   
      end if;

      --RETURN coalese(current_setting('app.settings.jwt_secret',true), current_setting('syslog_ident'), '');
      RETURN rc;

  END;  $$ LANGUAGE plpgsql;

------------
  -- Sets
------------
-- request.jwt.claim.user
-- request.jwt.claim.scope
-- request.jwt.claim.key

