'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionDelete extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'delete';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(criteria JSONB, owner_key TEXT) RETURNS JSONB
    
    AS $$
    
      --declare _crit JSONB;
      declare _result record;
      declare _status TEXT;
      declare _msg TEXT;
      declare _rc JSONB;
      
      BEGIN
        -- [Function: Delete by Primary Criteria {pk,sk}]
        -- [Description: Delete User by primary key {pk,sk}]
        -- [Validate Criteria]
        
          criteria := ${this.kind}_${this.version}.validate_criteria(criteria);
          if criteria is NULL then
          -- [Fail 400 when a criteria parameter is NULL]
            return format('{"status":"400","msg":"Bad Request","step":"%s"}',_step)::JSONB;
          end if;
     
          --if not(criteria ? 'pk') or  not(criteria ? 'sk') then -- {pk sk}
          --  -- [Fail 400 when criteria is missing pk or sk]
          --  return format('{"status":"400", "msg":"Bad Request", "criteria":%s}',criteria)::JSONB ;
          --end if;
          BEGIN
           
              --_crit := criteria::JSONB;
              -- there can be only one
              if criteria ? 'pk' and criteria ? 'sk' and criteria ->> 'sk' = '*' then
                  -- [Delete where pk and sk]
     
                  Delete from ${this.kind}_${this.version}.one
                    where lower(pk)=lower(criteria ->> 'pk') and owner=owner_key
                    returning * into _result;
    
              elsif criteria ? 'pk' and criteria ? 'sk' then
                -- [Delete where pk and sk]
    
                  Delete from ${this.kind}_${this.version}.one
                    where pk=lower(criteria ->> 'pk')
                          and sk=criteria ->> 'sk'
                          and owner=owner_key
                    returning * into _result;
    
              elsif criteria ? 'sk' and criteria ? 'tk' then
                Delete from ${this.kind}_${this.version}.one
                  where sk=criteria ->> 'sk' and tk=criteria ->> 'tk'
                  and owner=owner_key
                  returning * into _result;
              else
                  return format('{"status":"400", "msg":"Bad Request", "criteria":%s}',criteria)::JSONB ;
              end if;
              -- [Remove password from results when found]
              _rc :=  to_jsonb(_result)  #- '{form,password}';
              if _rc ->> 'pk' is NULL then
                -- [Fail 404 when primary key is not found]
                -- [Fail 404 when item is not owned by current]
                return format('{"status":"404", "msg":"Not Found", "owner":"%s", "criteria":%s}', owner_key, criteria)::JSONB ;
              end if;
          EXCEPTION
              when others then
                RAISE NOTICE '5 Beyond here there be dragons! %', sqlstate;
                return format('{"status":"%s", "msg":"Internal Server Error", "criteria":%s}',sqlstate,criteria)::JSONB ;
          END;
    
          -- [Return {status,msg,criteria,deletion}]
          return format('{"status":"200", "msg":"OK", "criteria":%s, "deletion":%s}',criteria,_rc::TEXT)::JSONB ;
      END;
    
      $$ LANGUAGE plpgsql;
    
    
    
    -- GRANT: Grant Execute
    
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(JSONB,TEXT) to api_user;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};