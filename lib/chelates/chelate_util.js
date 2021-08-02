'use strict';
//const { DataTypes } = require('../lib/data_types.js');
const { v4 as uuidv4 } = require( 'uuid');
//const { Password } = require( '../lib/password.js');
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
    //console.log('ChelatePattern', pattern);
    for (let k of pattern) {
      //console.log('k', k[0], k[1]);
      if (k[1].att) {
        //console.log('trans', k[1].att, ' to ', k[0]);
        console.log(k[0], '=',rc['form'][k[1].att]);
        rc[k[0]]=rc['form'][k[1].att];
      }
    }

    return rc;
  }
}
//module.exports = ChelateUtil;

