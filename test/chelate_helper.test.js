/* eslint-disable no-multi-assign */
// 'use strict';
const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

const { describe, it } = exports.lab = Lab.script();

const ChelateHelper = require('../lib/chelates/chelate_helper');

describe('ChelateHelper', () => {
  // Initialize
  it('ChelateHelper.resolve() form change ', () => {
    const chelate1 = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'abc',
        password: 'a1A!aaaa',
      },
      active: true,
      created: '2021-01-23T14:29:34.998Z',
    };
    const chelate2 = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'ABC',
        password: 'A1a!AAAA',
      },
      active: true,
      created: '2021-01-23T14:29:34.998Z',
    };

    const chelateResolved = (new ChelateHelper()).resolve(chelate1, chelate2);
    expect(typeof chelateResolved).to.equal('object');
    expect(chelateResolved.pk).to.equal('username#abc@xyz.com');
    expect(chelateResolved.sk).to.equal('const#USER');
    expect(chelateResolved.tk).to.equal('guid#520a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelateResolved.form.username).to.equal('abc@xyz.com');
    expect(chelateResolved.form.displayname).to.equal('ABC');
    expect(chelateResolved.form.password).to.equal('A1a!AAAA');
    expect(chelateResolved.active).to.equal(true);
    expect(chelateResolved.created).to.equal('2021-01-23T14:29:34.998Z');
  });

  it('ChelateHelper.resolve() partial form change ', () => {
    const chelate1 = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'abc',
        password: 'a1A!aaaa',
      },
      active: true,
      created: '2021-01-23T14:29:34.998Z',
    };
    const chelate2 = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        displayname: 'ABC',
      },
      active: true,
      created: '2021-01-23T14:29:34.998Z',
    };

    const chelateResolved = (new ChelateHelper()).resolve(chelate1, chelate2);
    expect(typeof chelateResolved).to.equal('object');
    expect(chelateResolved.pk).to.equal('username#abc@xyz.com');
    expect(chelateResolved.sk).to.equal('const#USER');
    expect(chelateResolved.tk).to.equal('guid#520a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelateResolved.form.username).to.equal('abc@xyz.com');
    expect(chelateResolved.form.displayname).to.equal('ABC');
    expect(chelateResolved.form.password).to.equal('a1A!aaaa');
    expect(chelateResolved.active).to.equal(true);
    expect(chelateResolved.created).to.equal('2021-01-23T14:29:34.998Z');
  });

  it('ChelateHelper.resolve() PK change ', () => {
    const chelate1 = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'abc',
        password: 'a1A!aaaa',
      },
      active: true,
      created: '2021-01-23T14:29:34.998Z',
    };
    const chelate2 = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'ABC@XYZ.COM',
        displayname: 'abc',
        password: 'a1A!aaaa',
      },
      active: true,
      created: '2021-01-23T14:29:34.998Z',
    };

    const chelateResolved = (new ChelateHelper()).resolve(chelate1, chelate2);

    expect(typeof chelateResolved).to.equal('object');
    expect(chelateResolved.pk).to.equal('username#ABC@XYZ.COM');
    expect(chelateResolved.sk).to.equal('const#USER');
    expect(chelateResolved.tk).to.equal('guid#520a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelateResolved.form.username).to.equal('ABC@XYZ.COM');
    expect(chelateResolved.form.displayname).to.equal('abc');
    expect(chelateResolved.form.password).to.equal('a1A!aaaa');
    expect(chelateResolved.active).to.equal(true);
    expect(chelateResolved.created).to.equal('2021-01-23T14:29:34.998Z');
  });
});
