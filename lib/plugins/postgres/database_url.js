'use strict';

const Consts = require('../../constants/consts.js');

module.exports = class DatabaseUrl {
  constructor(process) {
    // [* Heroku specific database url]
    this.db_url = process.env.DATABASE_URL;
    const regex = new RegExp(Consts.databaseUrlPattern());
    // [* Default to DATABASE_URL]
    // [* Search process.env for heroku color database url]
    for (let env in process.env) {
      if (regex.test(env)) {
        this.db_url = process.env[env];
      }
    }
    console.log('this.db_url', this.db_url);
  }
};