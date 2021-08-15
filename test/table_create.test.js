'use strict';

/* eslint-disable no-multi-assign */

const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();

const CreateTable = require('../lib/db/table_create.js');

describe('CreateTable construct', () => {
  // Initialize
  it('CreateTable constructor', () => {
    
    // eslint-disable-next-line no-undef
    const tableCreate = new CreateTable(process.env.DATABASE_URL);
    console.log('DATABASE_URL',tableCreate.connectionString);
    expect(tableCreate).to.exist();
    expect(tableCreate.connectionString).to.not.be.empty(); 
    expect(tableCreate.client).to.be.false(); 
  });

  it('CreateTable run', () => {
    
    // eslint-disable-next-line no-undef
    const tableCreate = new CreateTable(process.env.DATABASE_URL);
    
    // Run
    tableCreate.run();
    // console.log('tableCreate result', tableCreate.result);
    // console.log('tableCreate err', tableCreate.err);
   
    expect(tableCreate.client).to.not.false(); 
  });

});
