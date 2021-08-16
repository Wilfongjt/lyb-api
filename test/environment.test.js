/* eslint-disable no-undef */
/* eslint-disable no-console */
// 'use strict';
console.log('NPM_CONFIG_PRODUCTION', process.env.NPM_CONFIG_PRODUCTION);

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// eslint-disable-next-line no-multi-assign
const { before, describe, it } = exports.lab = Lab.script();
// const Co nsts = require('../lib/constants/co nsts.js');
// const ChelateHelper = require('../lib/chelates/chelate_helper.js');

describe('Environment', () => {
  // Initialize
  before(async () => {
    if (process.env.NODE_ENV !== 'production') {
      // [* Load Environment variables when not in production]
      // console.log('process.env.DEPLOY_ENV', process.env.DEPLOY_ENV);
      process.env.DEPLOY_ENV = '';
      // [* Call dotenv only on local install aka !production]
      if (!(process.env.NPM_CONFIG_PRODUCTION !== undefined)) {
        console.log('server dotenv load local');
        // eslint-disable-next-line global-require
        const path = require('path');
        // eslint-disable-next-line
        require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
      }
    }
  });

  it('Environment NODE_ENV', () => {
    // console.log('Environment process.env.NODE_ENV', process.env.NODE_ENV);
    expect(process.env.NODE_ENV).to.exists();
  });

  /*
  //it('Environment JWT_ CLAIMS', () => {
  //  expect(process.env.JWT_ CLAIMS).to.exists();
  //})
  */

  it('Environment JWT_SECRET', () => {
    // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    expect(process.env.JWT_SECRET).to.exists();
  });

  it('Environment API_TOKEN', () => {
    // console.log('Environment process.env.API_TOKEN', process.env.API_TOKEN);
    expect(process.env.API_TOKEN).to.exists();
  });

  it('Environment HOST', () => {
    // console.log('process.env.HOST', process.env.HOST);
    expect(process.env.HOST).to.exists();
  });

  it('Environment DATABASE_URL', () => {
    // console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);
    expect(process.env.DATABASE_URL).to.exists();
  });

  /*
  //it('Environment Types JWT_ CLAIMS', () => {
  //  expect(typeof(process.env.JWT_ CLAIMS)).to.equal('string');
  //})
  */
});
