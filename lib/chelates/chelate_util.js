'use strict';

const { ChelatePattern } = require( '../lib/chelate_pattern.js');

module.exports = class ChelateUtil {
  constructor() {

  }
  static clone(chelate) {
    return JSON.parse(JSON.stringify(chelate));
  }
  static updateFromForm(chelate) {
    // move form elements to keys
    // add or change updated
    // clone chelate
    // get ChelatePattern for constants and identifers
    //

    let pattern = new ChelatePattern(chelate);
    let rc = this.clone(chelate);
    for (let k of pattern) {
      if (k[1].att) {
        
        rc[k[0]]=rc['form'][k[1].att];
      }
    }

    return rc;
  }
};

