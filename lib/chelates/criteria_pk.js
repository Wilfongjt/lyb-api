// doesnt handle the xk yk variation
// PK SK
const Criteria = require('./criteria');

module.export = class CriteriaPK extends Criteria {
  constructor(chelate) {
    super(chelate, 'pk sk');
    if ((!this.pk || !this.sk)) {
      throw Error('Invalid Primary Key in CriteriaPK ');
    }
  }
};
