'use strict';
/* eslint-disable no-undef */

const pg = require('pg');

module.exports = class SqlRunner {
  constructor(connectionString) {
    // $lab:coverage:off$
      this.list = [];
      // console.log('Table')
      this.result = false;
      this.err = false;
      this.connectionString = connectionString;
      this.connectionConfig = {
        connectionString: connectionString,
        ssl: {
          sslmode: 'require',
          rejectUnauthorized: false,
        }
      };
      if (process.env.NODE_ENV !== 'production') {
        // [* Remove SSL when NODE_ENV !== production]
        if (!('NPM_CONFIG_PRODUCTION' in process.env)) {
          delete this.connectionConfig['ssl'];
        }
      }
      this.client=false;

      this.client = new pg.Client(this.connectionConfig);

      this.client.connect();
      // $lab:coverage:on$
  }    
  // $lab:coverage:off$
  add(sqlObject) {
    this.list.push(sqlObject);
    return this;
  }

  load(list) {
    for (let i in list) {
      this.add(list[i]);
    }
    return this;
  }

  end() {
    console.log('* SqlRunner ending...');
    if(this.client) {
      console.log('* SqlRunner disconnect');
      this.client.end();
    }
  }
  
  async run() {
    console.log('* SqlRunner run in');
    console.log('* ');

    if (this.length === 0) {
      console.log('* SqlRunner No sql defined');
    }

    for (let i in this.list) {
      // console.log('i',this.list[i]);
      await this.list[i].run(this.client);
      // console.log('  show', this.result);
      // console.log('result', this.list[i].result);
      // console.log('    show', this.result);
    }
  
    this.client.end();
    console.log('* SqlRunner out');

    return this;
  }
  // $lab:coverage:on$
};