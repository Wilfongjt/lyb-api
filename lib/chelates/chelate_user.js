'use strict';

const Chelate = require('./chelate.js');

module.exports =  class ChelateUser extends Chelate {
  constructor (form) {
    // form is a json form 
    // form is a chelate
    /* $lab:coverage:off$ */
    super({
      pk:{att: "username"},
      sk:{const: "USER"},
      tk:{guid: "*"}        // * is flag to calculate guid when not provided
    },form);
    /* $lab:coverage:on$ */
  }

};
