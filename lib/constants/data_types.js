'use strict';
class DataTypes {

  static userType() {
    return 'const#USER';
  }
  static dep_aliasType() {
    return 'const#ALIAS';
  }
  static in(typeName) {
    switch(typeName) {
      case 'const#USER': return true; break;
    }
    return false;
  }
}
module.exports = DataTypes;
