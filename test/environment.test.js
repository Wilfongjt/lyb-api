'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
//const Consts = require('../lib/constants/consts.js');
//const ChelateHelper = require('../lib/chelates/chelate_helper.js');

describe('Environment', () => {
  // Initialize
  it('Environment ', () => {

    expect(typeof(process.env.NODE_ENV)).to.exists();
    expect(typeof(process.env.JWT_CLAIMS)).to.exists();
    expect(typeof(process.env.JWT_SECRET)).to.exists();
    expect(typeof(process.env.API_TOKEN)).to.exists();
    expect(typeof(process.env.HOST)).to.exists();
    expect(typeof(process.env.DATABASE_URL)).to.exists();

  })

});
