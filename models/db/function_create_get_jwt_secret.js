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
 
        -- [* use app.settings.jwt_secret when available]
        -- [* use syslog_ident when app.settings.jwt_secret not available]
        rc := COALESCE(
           current_setting('app.settings.jwt_secret', true), 
           current_setting('syslog_ident') 
           )::TEXT;
        if length(rc) < 32 then
           -- [* force secret to be longer than 32]
           rc := format('%s%s%s%s%s',rc, rc, rc, rc, rc);
        end if;

        RETURN rc;
    END;  $$ LANGUAGE plpgsql;
    `;
    // console.log('CreateFunction', this.sql);
  }    
};