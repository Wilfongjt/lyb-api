'use strict';
const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
//const Consts = require('../lib/constants/consts.js');
const ChelateHelper = require('../lib/chelates/chelate_helper.js');

describe('ChelateHelper', () => {
  // Initialize
  it('ChelateHelper.resolve() form change ', () => {
    let chelate1 = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"abc",
         "password":"a1A!aaaa"
      },
      "active": true,
      "created": "2021-01-23T14:29:34.998Z"
    };
    let chelate2 = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"ABC",
         "password":"A1a!AAAA"
      },
      "active": true,
      "created": "2021-01-23T14:29:34.998Z"
    };

    let chelate_resolved = (new ChelateHelper()).resolve(chelate1, chelate2);
    //console.log('chelate_resolved',chelate_resolved);
    expect(typeof(chelate_resolved)).to.equal('object');
    expect(chelate_resolved.pk).to.equal("username#abc@xyz.com");
    expect(chelate_resolved.sk).to.equal("const#USER");
    expect(chelate_resolved.tk).to.equal("guid#520a5bd9-e669-41d4-b917-81212bc184a3");
    expect(chelate_resolved.form.username).to.equal("abc@xyz.com");
    expect(chelate_resolved.form.displayname).to.equal("ABC");
    expect(chelate_resolved.form.password).to.equal("A1a!AAAA");
    expect(chelate_resolved.active).to.equal(true);
    expect(chelate_resolved.created).to.equal("2021-01-23T14:29:34.998Z");

  })

  it('ChelateHelper.resolve() partial form change ', () => {
    let chelate1 = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"abc",
         "password":"a1A!aaaa"
      },
      "active": true,
      "created": "2021-01-23T14:29:34.998Z"
    };
    let chelate2 = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
         "displayname":"ABC",
      },
      "active": true,
      "created": "2021-01-23T14:29:34.998Z"
    };

    let chelate_resolved = (new ChelateHelper()).resolve(chelate1, chelate2);
    //console.log('pattern',pattern);
    expect(typeof(chelate_resolved)).to.equal('object');
    expect(chelate_resolved.pk).to.equal("username#abc@xyz.com");
    expect(chelate_resolved.sk).to.equal("const#USER");
    expect(chelate_resolved.tk).to.equal("guid#520a5bd9-e669-41d4-b917-81212bc184a3");
    expect(chelate_resolved.form.username).to.equal("abc@xyz.com");
    expect(chelate_resolved.form.displayname).to.equal("ABC");
    expect(chelate_resolved.form.password).to.equal("a1A!aaaa");
    expect(chelate_resolved.active).to.equal(true);
    expect(chelate_resolved.created).to.equal("2021-01-23T14:29:34.998Z");

  })


  it('ChelateHelper.resolve() PK change ', () => {
    let chelate1 = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"abc@xyz.com",
         "displayname":"abc",
         "password":"a1A!aaaa"
      },
      "active": true,
      "created": "2021-01-23T14:29:34.998Z"
    };
    let chelate2 = {
      pk: "username#abc@xyz.com",
      sk: "const#USER",
      tk: "guid#520a5bd9-e669-41d4-b917-81212bc184a3",
      form: {
        "username":"ABC@XYZ.COM",
         "displayname":"abc",
         "password":"a1A!aaaa"
      },
      "active": true,
      "created": "2021-01-23T14:29:34.998Z"
    };

    let chelate_resolved = (new ChelateHelper()).resolve(chelate1, chelate2);
    //console.log('pattern',pattern);
    expect(typeof(chelate_resolved)).to.equal('object');
    expect(chelate_resolved.pk).to.equal("username#ABC@XYZ.COM");
    expect(chelate_resolved.sk).to.equal("const#USER");
    expect(chelate_resolved.tk).to.equal("guid#520a5bd9-e669-41d4-b917-81212bc184a3");
    expect(chelate_resolved.form.username).to.equal("ABC@XYZ.COM");
    expect(chelate_resolved.form.displayname).to.equal("abc");
    expect(chelate_resolved.form.password).to.equal("a1A!aaaa");
    expect(chelate_resolved.active).to.equal(true);
    expect(chelate_resolved.created).to.equal("2021-01-23T14:29:34.998Z");

  })

});
