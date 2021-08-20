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
    // console.log('this.db_url', this.db_url);
    this.environment = process.env.NODE_ENV;
    // [* Database Environment]
    this.testable = false;
    if (process.env.DATABASE_URL === this.db_url) {
      // [* No testing in Heroku staging]
      // [* No testing in Heroku production]
      // [* No testing in Heroku review]
      // [* Test in local development]
      if (process.env.NODE_ENV === 'development') {
        // [* Environment is developement when NODE_ENV is development]
        // [* Testing occurs in development when db is initiated]
        
        this.environment = 'development';
        this.testable = true;
        // console.log('Development Database Connection');
      } else {
        // [* Environment is production when NODE_ENV is production]
        this.environment = 'production';
        // console.log('Production Database Connection');
      }
    } else {
      console.log("Branch", process.env.HEROKU_BRANCH);
      if (process.env.HEROKU_BRANCH) {
        // [* Environment is review when NODE_ENV is review]
        this.environment = 'review';
        // console.log('Review Database Connection');
      } else {
        // [* Environment is staging when NODE_ENV is staging]
        this.environment = 'staging';
        // console.log('Staging Database Connection');
      }
    }
  }
};