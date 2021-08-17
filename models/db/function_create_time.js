'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionTime extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'time';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}() RETURNS JSONB

    AS $$
    
      declare _time timestamp;
    
      declare _zone TEXT;
    
    BEGIN
    
      SELECT NOW()::timestamp into _time ;
    
      SELECT current_setting('TIMEZONE') into _zone;
    
      return format('{"status":"200", "msg":"OK", "time": "%s", "zone":"%s"}',_time,_zone)::JSONB;
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name} to api_guest;
    grant EXECUTE on FUNCTION ${this.name} to api_user;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};