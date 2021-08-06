const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
//const { init } = require('../lib/server');

const Password = require('../lib/auth/password.js');

describe('Password', () => {
  // Initialize
  it('new Password', () => {
   let form = {
     "username":"abc@xyz.com",
      "displayname":"abc",
      "password":"a1A!aaaa"
    };

    expect(new Password()).to.exist();

  })

  it('Hash Password', () => {
   //let dataTypes = new DataTypes();
   let form = {
     "username":"abc@xyz.com",
      "displayname":"abc",
      "password":"a1A!aaaa"
    };

    let password = new Password();
    form.password = password.hashify(form.password);
    ///console.log('form.password', form.password);

    expect(form.password.hash).to.exist();
    expect(form.password.salt).to.exist();

  })
  
  it('Verify Hashed Password', () => {
   let mypass = "a1A!aaaa";
   let form = {
     "username":"abc@xyz.com",
      "displayname":"abc",
      "password":mypass
    };

    let password = new Password();
    form.password = password.hashify(form.password);
    //console.log('form.password', form.password);

    expect(password.verify('a1A!aaaa', form.password)).to.true();
    expect(password.verify('x1X!xxxx', form.password)).to.false();

  })

});
