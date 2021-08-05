'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
//const Consts = require('../lib/constants/consts.js');
//const ChelateHelper = require('../lib/chelates/chelate_helper.js');

describe('Environment', () => {
  // Initialize
  it('Environment NODE_ENV', () => {

    expect(process.env.NODE_ENV).to.exists();

  })
  //it('Environment JWT_ CLAIMS', () => {

  //  expect(process.env.JWT_ CLAIMS).to.exists();

  //})
  it('Environment JWT_SECRET', () => {

    expect(process.env.JWT_SECRET).to.exists();

  })
  it('Environment API_TOKEN', () => {

    expect(process.env.API_TOKEN).to.exists();

  })
  it('Environment HOST', () => {

    expect(process.env.HOST).to.exists();
    
  })
  it('Environment DATABASE_URL', () => {

    expect(process.env.DATABASE_URL).to.exists();
    

  })

  //it('Environment Types JWT_ CLAIMS', () => {

  //  expect(typeof(process.env.JWT_ CLAIMS)).to.equal('string');
    
  //})
});
