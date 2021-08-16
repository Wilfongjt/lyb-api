'use strict';
// const pg = require('pg');
const Step = require('../../lib/runner/step');
module.exports = class CreateTable extends Step {
  constructor(kind) {
    super();
    this.kind = kind;
    this.name = `one_${this.kind}`;
    this.sql = `CREATE TABLE if not exists base_0_0_1.${this.name} (
        pk TEXT DEFAULT format('guid#%s',uuid_generate_v4 ()),
        sk TEXT not null check (length(sk) < 500),
        tk TEXT DEFAULT format('guid#%s',uuid_generate_v4 ()),
        form jsonb not null,
        active BOOLEAN NOT NULL DEFAULT true,
        created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        owner TEXT
      );
      CREATE UNIQUE INDEX IF NOT EXISTS ${this.name}_first_idx ON base_0_0_1.${this.name}(pk,sk);
      CREATE UNIQUE INDEX IF NOT EXISTS ${this.name}_second_idx ON base_0_0_1.${this.name}(sk,tk);
      /* speed up adoptees query by bounding rect */
      CREATE UNIQUE INDEX IF NOT EXISTS ${this.name}_second_flip_idx ON base_0_0_1.${this.name}(tk, sk);
    `;
    // console.log('CreateTable', this.sql);
  }    
  


};