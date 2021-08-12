/* eslint-disable no-multi-assign */
const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { describe, it } = exports.lab = Lab.script();

const ChelatePattern = require('../lib/chelates/chelate_pattern.js');

describe('ChelatePattern', () => {
  // Initialize
  // 1
  it('ChelatePattern No Change', () => {
    const chelate = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'abc',
        password: 'a1A!aaaa',
      },
    };
    const pattern = new ChelatePattern(chelate);
    expect(pattern.pk).to.be.a.object();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();
    expect(pattern.hasKeyChange()).to.be.a.boolean();
    expect(pattern).to.equal({ pk: { att: 'username' }, sk: { const: 'USER' }, tk: { guid: '520a5bd9-e669-41d4-b917-81212bc184a3' } });
  });
  // 2
  it('ChelatePattern Form Change', () => {
    const chelate = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'abc changed',
        password: 'a1A!aaaa',
      },
    };
    const pattern = new ChelatePattern(chelate);
    expect(pattern.pk).to.be.a.object();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();
    expect(pattern.pk).to.equal({ att: 'username' });
    expect(pattern.sk).to.equal({ const: 'USER' });
    expect(pattern.tk).to.equal({ guid: '520a5bd9-e669-41d4-b917-81212bc184a3' });

    expect(pattern.hasKeyChange()).to.be.false();
  });
  // 3
  it('ChelatePattern PK SK Change', () => {
    const chelate = {
      pk: 'username#abc@xyz.com',
      sk: 'displayname#abc',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc-changed@xyz.com',
        displayname: 'abc changed',
        password: 'a1A!aaaa',
      },
    };
    const pattern = new ChelatePattern(chelate);

    expect(pattern.pk).to.be.a.object();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();

    expect(pattern.pk).to.equal({ att: 'username', keyChanged: true });
    expect(pattern.sk).to.equal({ att: 'displayname', keyChanged: true });
    expect(pattern.tk).to.equal({ guid: '520a5bd9-e669-41d4-b917-81212bc184a3' });

    expect(pattern.hasKeyChange()).to.equal(true);
  });

  // 4

  it('ChelatePattern SK TK Change', () => {
    const chelate = {
      sk: 'displayname#abc',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        password: 'a1A!aaaa',
      },
    };
    const pattern = new ChelatePattern(chelate);

    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();

    expect(pattern.sk).to.equal({ att: 'displayname' });
    expect(pattern.tk).to.equal({ guid: '520a5bd9-e669-41d4-b917-81212bc184a3' });

    expect(pattern.hasKeyChange()).to.equal(false);
  });

  // 5

  it('ChelatePattern getKeyMap', () => {
    const chelate = {
      pk: 'username#abc@xyz.com',
      sk: 'const#USER',
      tk: 'guid#520a5bd9-e669-41d4-b917-81212bc184a3',
      form: {
        username: 'abc@xyz.com',
        displayname: 'abc',
        password: 'a1A!aaaa',
      },
    };
    const pattern = new ChelatePattern(chelate);
    expect(pattern.getKeyMap()).to.exist();
    expect(pattern.getKeyMap()).to.equal({ pk: { att: 'username' }, sk: { const: 'USER' }, tk: { guid: '520a5bd9-e669-41d4-b917-81212bc184a3' } });
  });
});
