'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionDeleteTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);

    this.name = '\'delete\'';
    
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.notFoundUserName ='\'notfound@user.com\'';
    this.username = '\'delete@user.com\'';
    this.displayname = '\'J\'';
    this.recType = '\'const#USER\'';
    this.key1 = '\'duckduckgoose\'';
    this.pkName = '\'username\'';
    this.pk = `format('%s#%s', ${this.pkName}, ${this.username})`;
    this.form = `format('{"%s":"%s", "displayname":"%s", "password":"a1!Aaaaa"}', ${this.pkName}, ${this.username}, ${this.displayname})::JSONB`;
    this.criteriaOK = `format('{"pk":"%s#%s", "sk":"%s"}', ${this.pkName}, ${this.username}, ${this.recType} )::JSONB`;
    this.criteriaNF = `format('{"pk":"%s#%s", "sk":"%s"}', ${this.pkName}, ${this.notFoundUserName}, ${this.recType} )::JSONB`;
    

    this.sql = `BEGIN;
    
      SELECT plan(3);
    
      insert into ${this.kind}_${this.version}.one
        (pk,sk,tk,form,owner)
        values
        (format('%s#%s',${this.pkName}, ${this.username}), ${this.recType}, ${this.key1}, ${this.form}, ${this.key1} ) ;
      
      SELECT has_function(
          '${this.kind}_${this.version}',
          'delete',
          ARRAY[ 'JSONB', 'TEXT' ],
          'Function Delete (jsonb,text) exists'
      );
    
      -- 2
    
      SELECT is (
    
        ${this.kind}_${this.version}.delete( ${this.criteriaNF}, ${this.key1} )::JSONB,
    
        '{"msg": "Not Found", "owner": "duckduckgoose", "status": "404", "criteria": {"pk": "username#notfound@user.com", "sk": "const#USER"}}'::JSONB,
    
        'delete pk sk form,  Not Found 0_0_1'::TEXT
    
      );
      
      -- 3
    
      SELECT is (
    
        (${this.kind}_${this.version}.delete(
    
          format('{"pk":"%s#%s", "sk":"%s"}', ${this.pkName}::TEXT, ${this.username}::TEXT, ${this.recType}::TEXT)::JSONB,
    
          ${this.key1}
    
        )::JSONB - '{"deletion","criteria"}'::TEXT[]),
    
        '{"msg":"OK","status":"200"}'::JSONB,
    
        'delete pk sk form,  OK 0_0_1'::TEXT
    
      );
      
      SELECT * FROM finish();
    
    ROLLBACK;
    
    END;
    `;
     // $lab:coverage:on$
  }    
};