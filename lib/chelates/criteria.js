/* eslint-disable no-prototype-builtins */
// doesnt handle the xk yk variation
module.exports = class Criteria {
  constructor(chelate, metaKeys = 'pk sk tk xk yk') {
    // this.tablename='one';
    // no value
    if (!chelate || Object.keys(chelate).length === 0) {
      throw new Error('Missing Criteria');
    }

    if (typeof chelate !== 'object') {
      throw Error('Must initialize Criteria with object.');
    }

    /*
    if ((!chelate.pk && !chelate.sk && !chelate.xk) ) {
      throw Error('Criteria is Missing Key');
    }
    if ((!chelate.sk && !chelate.tk && !chelate.yk) ) {
      throw Error('Criteria is Missing Key');
    }
    */

    // eslint-disable-next-line no-restricted-syntax
    for (const key in chelate) {
      if (metaKeys.includes(key)) {
        this[key] = chelate[key];
      }
    }
  }
};
