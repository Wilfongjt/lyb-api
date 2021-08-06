'use strict';
// [# lyb-api]
console.log('[* Starting...]');
/*
if (process.env.NODE_ENV !== 'production') {
  // [* Load .env when NODE_ENV is development]
  console.log('[* Server loading .env]');
  process.env.DEPLOY_ENV='';
  const path = require('path');
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}
*/
//console.log('starting 2...');
// this setup enables testing
const { start } = require('./lib/server');

start();
