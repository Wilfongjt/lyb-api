'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
//const Consts = require('../lib/constants/consts.js');
//const ChelateHelper = require('../lib/chelates/chelate_helper.js');

describe('Environment', () => {
  // Initialize
  it('Environment ', () => {

    expect(process.env.NODE_ENV).to.exists();
    expect(process.env.JWT_CLAIMS).to.exists();
    expect(process.env.JWT_SECRET).to.exists();
    expect(process.env.API_TOKEN).to.exists();
    expect(process.env.HOST).to.exists();
    expect(process.env.DATABASE_URL).to.exists();
    

  })

});
