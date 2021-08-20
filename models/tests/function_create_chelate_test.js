'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionChelateTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'chelate';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;

    SELECT plan(2);

    -- 1
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'chelate',
  
        ARRAY[ 'JSONB', 'JSONB' ],
  
        'Function chelate(jsonb, jsonb) exists'
  
    );
  
    -- 2
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
        '{"pk":"a","sk":"b","tk":"c"}'::JSONB,
  
        '{
  
            "a":"v1",
  
            "b":"v2",
  
            "c":"v3",
  
            "d":"v4"
  
          }'::JSONB
  
      )::JSONB ->> 'pk' = 'a#v1',
  
      'chelate (keys JSONB, form JSONB) 0_0_1'::TEXT
  
    );
  
    SELECT * FROM finish();
  
  
  
  ROLLBACK;
  
  
  
  
  
  
  
  
  BEGIN;
  
  
  
    SELECT plan(11);
  
    -- 1
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'chelate',
  
        ARRAY[ 'JSONB' ],
  
        'Function chelate(jsonb) exists'
  
    );
  
    -- 2
  
    SELECT ok (
  
      (${this.kind}_${this.version}.chelate(
  
        '{
  
          "pk":"username#update@user.com",
  
          "sk":"const#TEST",
  
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
          "form":{
  
                  "displayname":"k"
  
                }
  
          }'::JSONB
  
      ) ->> 'form')::JSONB  = '{"displayname":"k"}'::JSONB,
  
      'chelate No key changes when form missing key values and displayname changed 0_0_1'::TEXT
  
    );
  
    -- 3
  
    -- chelate prove 'changed' is immutable 0_0_1
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
        '{
  
          "pk":"username#update@user.com",
  
          "sk":"const#TEST",
  
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
          "form":{
  
                  "displayname":"k"
  
                },
  
          "created":"2021-02-21 20:44:47.442374"
  
          }'::JSONB
  
      ) ->> 'created' = '2021-02-21 20:44:47.442374',
  
      'chelate "changed" is immutable 0_0_1'::TEXT
  
    );
  
    -- 4
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
        '{
  
          "pk":"username#update@user.com",
  
          "sk":"const#TEST",
  
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
  
          "form":{
  
                  "displayname":"k"
  
                },
  
          "created":"2021-02-21 20:44:47.442374"
  
          }'::JSONB
  
      ) ->> 'updated' != '2021-02-21 20:44:47.442374',
  
      'chelate "updated" is mutable 0_0_1'::TEXT
  
    );
  
    -- 5
  
    -- no pk change
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
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
  
      ) ->> 'pk' = 'username#update@user.com',
  
  
  
      'chelate PK changes when form displayname changed 0_0_1'::TEXT
  
    );
  
    -- 6
  
    -- no sk change
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
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
  
      ) ->> 'sk' = 'const#TEST',
  
  
  
      'chelate SK changes when form displayname changed 0_0_1'::TEXT
  
    );
  
    -- 7
  
    -- no tk change
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
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
  
      ) ->> 'tk' = 'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
  
      'chelate TK changes when form displayname changed 0_0_1'::TEXT
  
    );
  
    -- 8
  
    SELECT ok (
  
      (${this.kind}_${this.version}.chelate(
  
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
  
      ) ->> 'pk') = 'username#CHANGEupdate@user.com',
  
  
  
      'chelate Detect pk key changes 0_0_1'::TEXT
  
    );
  
    -- 9
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
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
  
      ) ->> 'sk' = 'const#CHANGETEST',
  
  
  
      'chelate Detect sk key changes 0_0_1'::TEXT
  
    );
  
    -- 10
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
  
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
  
      ) ->> 'tk' = 'guid#CHANGE820a5bd9-e669-41d4-b917-81212bc184a3',
  
  
  
      'chelate Detect tk key changes 0_0_1'::TEXT
  
    );
  
    -- 11
  
    SELECT ok (
  
      ${this.kind}_${this.version}.chelate(
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
      ) ->> 'pk' = 'username#CHANGEupdate@user.com',
  
      'chelate Detect pk sk tk key changes 0_0_1'::TEXT
  
    );
  
    SELECT * FROM finish();
  
  ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};