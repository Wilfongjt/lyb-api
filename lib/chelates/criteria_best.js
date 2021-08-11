const Criteria = require('./criteria');

module.export = class CriteriaBest extends Criteria {
  constructor(chelate) {
    super(chelate, 'pk sk tk xk yk');

    if (this.pk) {
      if (this.tk) {
        delete this.tk;
      }
    }
    if (this.xk) {
      if (this.pk) {
        delete this.pk;
      }
      if (this.sk) {
        delete this.sk;
      }
      if (this.tk) {
        delete this.tk;
      }
    }
  }
};
