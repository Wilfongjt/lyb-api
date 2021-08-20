'use strict';
const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionChangedKeyTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'changed_key';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;

    SELECT plan(9);
  
    -- 1
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'changed_key',
  
        ARRAY[ 'JSONB' ],
  
        'Function Changed_Key (jsonb) exists'
  
    );
  
    -- 2
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
          "pk":"username#update@user.com",
  
          "sk":"const#TEST",
  
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
          "form":{
  
                  "displayname":"k"
  
                }
  
          }'::JSONB
  
      ),
  
      false,
  
      'No key changes when form missing key values and displayname changed 0_0_1'::TEXT
  
    );
  
    -- 3
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "pk":"username#update@user.com",
  
            "sk":"const#TEST",
  
            "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
            "form":{
  
              "username":"update@user.com",
  
              "displayname":"k",
  
              "const": "TEST",
  
              "guid": "820a5bd9-e669-41d4-b917-81212bc184a3"
  
            }
  
          }'::JSONB
  
      ),
  
      false,
  
      'No key changes when form displayname changed 0_0_1'::TEXT
  
    );
  
    -- 4
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "pk":"username#update@user.com",
  
            "sk":"const#TEST",
  
            "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
            "form":{
  
              "username":"CHANGEupdate@user.com",
  
              "displayname":"k",
  
              "const": "TEST",
  
              "guid": "820a5bd9-e669-41d4-b917-81212bc184a3"
  
            }
  
          }'::JSONB
  
      ),
  
      true,
  
      'Detect pk key changes 0_0_1'::TEXT
  
    );
  
    -- 5
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "pk":"username#update@user.com",
  
            "sk":"const#TEST",
  
            "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
            "form":{
  
              "username":"update@user.com",
  
              "displayname":"k",
  
              "const": "CHANGETEST",
  
              "guid": "820a5bd9-e669-41d4-b917-81212bc184a3"
  
            }
  
          }'::JSONB
  
      ),
  
      true,
  
      'Detect sk key changes 0_0_1'::TEXT
  
    );
  
  
  
    -- 6
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "pk":"username#update@user.com",
  
            "sk":"const#TEST",
  
            "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
            "form":{
  
              "username":"CHANGEupdate@user.com",
  
              "displayname":"k",
  
              "const": "CHANGETEST",
  
              "guid": "CHANGE820a5bd9-e669-41d4-b917-81212bc184a3"
  
            }
  
          }'::JSONB
  
      ),
  
      true,
  
      'Detect pk sk tk key changes 0_0_1'::TEXT
  
    );
  
    -- 7
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "sk":"const#USER",
  
            "tk":"guid#8820a5bd9-e669-41d4-b917-81212bc184a3",
  
            "form":{
  
              "username":"username#update@user.com",
  
              "displayname":"k",
  
              "const": "const#USER"
  
            }
  
          }'::JSONB
  
      ),
  
      true,
  
      'Detect sk tk key changes 0_0_1'::TEXT
  
    );
  
    -- 8
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "pk":"username#update@user.com",
  
            "sk":"const#USER",
  
            "form":{
  
              "username":"username#update@user.com",
  
              "displayname":"k",
  
              "const": "const#USER"
  
            }
  
          }'::JSONB
  
      ),
  
      true,
  
      'Detect pk sk key changes 0_0_1'::TEXT
  
    );
  
    -- 9
  
    SELECT is (
  
      ${this.kind}_${this.version}.changed_key(
  
        '{
  
            "pk":"username#update@user.com",
  
            "sk":"const#TEST",
  
            "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
            "form":{
  
              "username":"update@user.com",
  
              "displayname":"k",
  
              "const": "TEST",
  
              "guid": "CHANGE820a5bd9-e669-41d4-b917-81212bc184a3"
  
            }
  
          }'::JSONB
  
      ),
  
      false,
  
      'Detect tk key changes 0_0_1'::TEXT
  
    );
  
    SELECT * FROM finish();
  
  ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};