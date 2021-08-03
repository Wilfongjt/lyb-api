'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
//import Consts from '../../lib/constants/consts.js';
const ChelatePattern = require('../lib/chelates/chelate_pattern.js');

describe('ChelatePattern', () => {
  // Initialize
  it('ChelatePattern No Change', () => {
    let chelate = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"abc",
         "password":"a1A!aaaa"
      }
    };
    let pattern = new ChelatePattern(chelate);
    //console.log('pattern',pattern);
    expect(pattern.pk).to.be.a.object();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();
    expect(pattern.keyChanged()).to.be.a.boolean();
    expect(pattern).to.equal({pk: {"att":"username"}, sk:{"const":"USER"}, tk:{"guid":"520a5bd9-e669-41d4-b917-81212bc184a3"}});
  })

  it('ChelatePattern Form Change', () => {
    let chelate = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"abc changed",
         "password":"a1A!aaaa"
      }
    };
    let pattern = new ChelatePattern(chelate);
    //console.log('pattern',pattern);
    expect(pattern.pk).to.be.a.object();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();
    expect(pattern.pk).to.equal({"att": "username"});
    expect(pattern.sk).to.equal({"const": "USER"});
    expect(pattern.tk).to.equal({"guid": "520a5bd9-e669-41d4-b917-81212bc184a3"});

    expect(pattern.keyChanged()).to.be.false();
  })


  it('ChelatePattern PK SK Change', () => {
    let chelate = {
      pk: "username#abc@xyz.com",
      sk: "displayname#abc",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc-changed@xyz.com",
         "displayname":"abc changed",
         "password":"a1A!aaaa"
      }
    };
    let pattern = new ChelatePattern(chelate);
    //console.log('pattern',pattern);
    //console.log('pattern.keyChanged()', pattern.keyChanged(), pattern.get('keyChanged'));
    expect(pattern.pk).to.be.a.object();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();

    expect(pattern.pk).to.equal({att: 'username', keyChanged:true});
    expect(pattern.sk).to.equal({att: 'displayname', keyChanged:true});
    expect(pattern.tk).to.equal({"guid": "520a5bd9-e669-41d4-b917-81212bc184a3"});

    expect(pattern.keyChanged()).to.equal(true);

  })

  it('ChelatePattern SK TK Change', () => {
    let chelate = {
      sk: "displayname#abc",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
         "password":"a1A!aaaa"
      }
    };
    let pattern = new ChelatePattern(chelate);
    //console.log('test ChelatePattern pattern',pattern);
    //console.log('pattern.keyChanged()', pattern.keyChanged(), pattern.get('keyChanged'));
    //expect(pattern.pk).toBeTruthy();
    expect(pattern.sk).to.be.a.object();
    expect(pattern.tk).to.be.a.object();

    //expect(pattern.pk).to.equal({att: 'username'});
    expect(pattern.sk).to.equal({att: 'displayname'});
    expect(pattern.tk).to.equal({"guid": "520a5bd9-e669-41d4-b917-81212bc184a3"});

    expect(pattern.keyChanged()).to.equal(false);

  })

  it('ChelatePattern getKeyMap', () => {
    let chelate = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"abc",
         "password":"a1A!aaaa"
      }
    };
    let pattern = new ChelatePattern(chelate);
    //console.log('pattern.keyMap()',pattern.keyMap());
    expect(pattern.getKeyMap()).to.exist();
    expect(pattern.getKeyMap()).to.equal({pk: {"att":"username"}, sk:{"const":"USER"}, tk:{"guid":"520a5bd9-e669-41d4-b917-81212bc184a3"}});

  })

});
