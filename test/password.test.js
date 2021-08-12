const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// eslint-disable-next-line no-multi-assign
const { describe, it } = exports.lab = Lab.script();

// const { init } = require('../lib/server');

const Password = require('../lib/auth/password');

describe('Password', () => {
  // Initialize
  it('new Password', () => {
    expect(new Password()).to.exist();
  });

  it('Hash Password', () => {
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: 'a1A!aaaa',
    };

    const password = new Password();
    form.password = password.hashify(form.password);
    // console.log('form.password', form.password);

    expect(form.password.hash).to.exist();
    expect(form.password.salt).to.exist();
  });

  it('Verify Hashed Password', () => {
    const mypass = 'a1A!aaaa';
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: mypass,
    };

    const password = new Password();
    form.password = password.hashify(form.password);
    // console.log('form.password', form.password);

    expect(password.verify('a1A!aaaa', form.password)).to.true();
    expect(password.verify('x1X!xxxx', form.password)).to.false();
  });
});
