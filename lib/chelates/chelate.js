/* eslint-disable dot-notation */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const { v4: uuidv4 } = require('uuid');

const ChelatePattern = require('./chelate_pattern');

module.exports = class Chelate {
  constructor(keyMap, form) {
    /* $lab:coverage:off$ */
    this.stub = null;
    if (!keyMap) {
      throw new Error('Chelate is missing keyMap');
    }
    if (!form) {
      throw new Error('Chelate is missing form');
    }
    // create new when a form is provided
    // eslint-disable-next-line default-case
    switch (this.guessFormType(keyMap, form)) {
      case 1: /* form */
        this.assignForm(keyMap, form);
        break;
      case 2: /* chelate + form */
        this.assignChelate(keyMap, form);
        break;
    }

    /* $lab:coverage:on$ */
  }

  guessFormType(keyMap, obj) {
    /* $lab:coverage:off$ */
    this.stub = null;
    if (!keyMap) {
      return 0; /* unhandled */
    }
    if (!obj) {
      return 0; /* unhandled */
    }
    let rc = 0;
    if (obj.pk && obj.sk && obj.tk && obj.form) {
      rc = 2; /* chelate with form */
    } else if (!obj.pk && !obj.sk && !obj.tk && !obj.form) {
      rc = 1; /* form */
    }
    return rc; /* unhandled */
    /* $lab:coverage:on$ */
  }

  assignForm(keyMap, form) {
    /* $lab:coverage:off$ */
    for (const k in keyMap) { /*  k is integer */
      if (keyMap[k] && keyMap[k]['att']) {
        const isKeyNameInForm = form[keyMap[k]['att']];
        if (!isKeyNameInForm) {
          throw new Error(`Chealate form must contain ${keyMap[k]['att']} ${form[keyMap[k]['att']]}`);
        }
        // <form-attribute-name>#<value>  eg username#john@gmail.com
        const formName = keyMap[k]['att'];
        const formVal = form[keyMap[k]['att']];
        this[k] = `${formName}#${formVal}`;
      } else if (keyMap[k] && keyMap[k].const) { /* eg USER */
        const constVal = keyMap[k].const;
        this[k] = `const#${constVal}`;
      } else if (keyMap[k] && keyMap[k].guid) { /* eg 820a5bd9-e669-41d4-b917-81212bc184a3 */
        const guidValue = keyMap[k].guid;
        this[k] = `guid#${guidValue}`;
        if (this[k] === 'guid#*') { /* calculate the guid */
          // this[k] = 'guid#' + uuidv4();
          this[k] = `guid#${uuidv4()}`;
        }
      }
    }
    // chelate has to have all keys in key_map
    this.form = JSON.parse(JSON.stringify(form));

    this.active = true;

    const dat = new Date();
    this.created = dat;
    // updated is changed in the update process
    this.updated = dat;

    return this;
    /* $lab:coverage:on$ */
  }

  assignChelate(keyMap, chelate) {
    /* $lab:coverage:off$ */
    for (const k in chelate) {
      this[k] = chelate[k];
    }
    for (const k in keyMap) {
      if (!this[k]) {
        throw new Error(`Missing ${k} key.`);
      }
    }
    if (!this.active) {
      this.active = true;
    }
    const dat = new Date();
    if (!this.created) {
      this.created = dat;
    }
    // updated is changed in the update process
    if (!this.updated) {
      this.updated = dat;
    }
    return this;
    /* $lab:coverage:on$ */
  }

  toJson() {
    /* $lab:coverage:off$ */
    const rc = {};

    for (const k in this) {
      rc[k] = this[k];
    }

    return rc;
    /* $lab:coverage:on$ */
  }

  getKeyMap() {
    /* $lab:coverage:off$ */
    const pattern = new ChelatePattern(this);
    return pattern.getKeyMap();
    /* $lab:coverage:on$ */
  }
};
