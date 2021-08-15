'use strict';
const pg = require('pg');

module.exports = class SqlRunner {
  constructor(connectionString) {
      this.list = [];
      // console.log('Table')
      this.result = false;
      this.err = false;
      this.connectionString = connectionString;
      this.client=false;
      // console.log('connectionString', this.connectionString);
      this.client = new pg.Client(this.connectionString);
      this.client.connect();
  }    
  
  add(sqlObject) {
    this.list.push(sqlObject);
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

    if (this.length === 0) {
      console.log('* SqlRunner No sql defined');
    }

    for (let i in this.list) {
      // console.log('i',this.list[i]);
      await this.list[i].run(this.client);
    }
  
    this.client.end();
    console.log('* SqlRunner out');

    return this;
  }
  
};