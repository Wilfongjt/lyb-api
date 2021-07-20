'use strict';
// [# lyb-api]
console.log('starting...');
if (process.env.NODE_ENV !== 'production') {

  //console.log(```loading ${process.env.NODE_ENV} environment...```);
  process.env.DEPLOY_ENV=''
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}
console.log('starting 2...');
// this setup enables testing
const { start } = require('./lib/server');

start();
