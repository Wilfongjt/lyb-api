'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateTable extends Step {
  constructor(kind, baseVersion) {
    super(kind, baseVersion);
    // this.kind = kind;
    // this.version = baseVersion;
    // this.name = 'one';
    // this.sql = `CREATE TABLE if not exists ${this.kind}_${this.version}.${this.name} (
    this.name = `${this.kind}_${this.version}.one`;
    this.sql = `CREATE TABLE if not exists ${this.name} (  
        pk TEXT DEFAULT format('guid#%s',uuid_generate_v4 ()),
        sk TEXT not null check (length(sk) < 500),
        tk TEXT DEFAULT format('guid#%s',uuid_generate_v4 ()),
        form jsonb not null,
        active BOOLEAN NOT NULL DEFAULT true,
        created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        owner TEXT
      );
      CREATE UNIQUE INDEX IF NOT EXISTS one_first_idx ON ${this.name}(pk,sk);
      CREATE UNIQUE INDEX IF NOT EXISTS one_second_idx ON ${this.name}(sk,tk);
      /* speed up adoptees query by bounding rect */
      CREATE UNIQUE INDEX IF NOT EXISTS one_second_flip_idx ON ${this.name}(tk, sk);
    `;
    // console.log('** CreateTable', this.name);
  }    
  


};