'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionGetJwtSecret extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'get_jwt_secret';
    this.name = `${this.kind}_${this.version}.${this.name}`;

    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}() RETURNS TEXT
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
    `;
    // console.log('CreateFunction', this.sql);
  }    
};