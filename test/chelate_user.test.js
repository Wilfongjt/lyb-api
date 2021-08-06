'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
/*
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  process.env.DEPLOY_ENV=''

  const path = require('path');
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}
import Consts from '../../lib/constants/consts.js';
import DataTypes from '../../lib/constants/data_types.js';
*/
const ChelateUser  = require('../lib/chelates/chelate_user.js');

describe('ChelateUser New', () => {
  // Initialize
  it('new ChelateUser', () => {
   let form = {
     "username":"abc@xyz.com",
      "displayname":"abc",
      "password":"a1A!aaaa"
    };
    let chelate = {
      pk: "update@user.com",
      sk: "const#USER",
      tk: "guid#820a5bd9-e669-41d4-b917-81212bc184a3",
      form: form
    };
    let chelateUserForm = new ChelateUser(form);
    let chelateUserChelate = new ChelateUser(chelate);

    // New from Form
    expect(chelateUserForm).to.exist();
    // New from Chelate
    expect(chelateUserChelate).to.exist();

    expect(chelateUserForm.tk === chelateUserChelate.tk ).to.be.false();
    expect(chelateUserForm.form.username === chelateUserChelate.form.username ).to.be.true();

  })

});
