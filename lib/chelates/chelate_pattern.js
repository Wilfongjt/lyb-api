/* eslint-disable guard-for-in */
/*
Prmary Key is a combination of a Partition Key (pk) and a Sort Key (sk)
Secondary Key is a combination of Sort Key (sk) and Tertiary Key (tk)

[pk,sk,tk] in {pk:A, sk:B, tk:C form: {x:A,y:B,z:C,w:D,v:E}, created:"DT1"}

table state
(A  B  C  (A B C D E))

Table State               Change                 Merged                   Change partition in form
(partition (form))
(pk sk tk (x y z w v))
(A  B  C  (A B C G H)) + (A  B  C  (A B C G h) -> (A  B  C  (A B C G h))   Y  FU
(A  B  C  (A B C G h)) + (A  B  C  (A B C g h) -> (A  B  C  (A B C g h))   Y  FU
(A  B  C  (A B C g h)) + (A  B  C  (A B c g h) -> (A  B  c  (A B c g h))   N  FCUDI
(A  B  c  (A B c g h)) + (A  B  c  (A b c g h) -> (A  b  c  (A b c g h))   N  FCUDI
(A  b  c  (A b c g h)) + (A  b  c  (a b c g h) -> (a  b  c  (a b c g h))   N  FCUDI
(a  b  c  (a b c g h))

Partition is the list of keys in a chelate,
  or all the keys that are not [active, created, updated, form]
Chelate Pattern is the pattern of keys mapped to form attributes
  given the chelate:   {pk:A, sk:B, tk:C form: {x:A,y:B,z:C,w:D,v:E}}
  outputs the pattern: {pk:{att:x}, sk:{att:y}, tk:{att:z}}
  given the chelate:   {pk:A, sk:B, tk:CCC form: {x:A,y:B,z:C,w:D,v:E}}
  outputs the pattern: {pk:{att:x}, sk:{att:y}, tk:{const:CCC}}
  given the chelate:   {pk:A, sk:520a5bd9-e, tk:CCC form: {x:A,y:B,z:C,w:D,v:E}}
  outputs the pattern: {pk:{att:x}, sk:{id:520a5bd9-e}, tk:{const:CCC}}
  given the chelate:   {pk:a, sk:520a5bd9-e, tk:CCC form: {x:A,y:B,z:C,w:D,v:E}}
  outputs the pattern: {pk:{:x}, sk:{id:520a5bd9-e}, tk:{const:CCC}}

isUpdate given a {pk:{att:"x"}, sk:{att:"y"}, tk:{att:"z"}}
  is it in a chelate {pk:A, sk:B, tk:C form: {x:A,y:B,z:C,w:D,v:E}}
PFPCU is Partition, Find, Pattern, Chelate, Update
PFPCDI is Partition, Find, Pattern, Chelate, Delete, Insert
Process

curl -d "" -H "X-HTTP-Method-Override:GET" http://localhost:8080/user

Read Chelate e.g., POST /user {pk:A, sk:B} || {sk:B, tk:C}

Collect Changes to Chelate-Form from user (user never changes the Chelate's Partition)
Submit (PUT) Chelate with Form changes (in-chelate) to API
    partition = getPartition(in-chelate)
    cur-chelate = find(partition)
    partition-pattern = getPartitionPattern(cur-chelate)
    new-chelate = chelate(partition-patten, in-chelate)

  - if isUpdate(partitionPattern, in-chelate)
      // PFPCU
      update(new-chelate)
    else // replace the cur-chelate in table
      // PFPCDI
      delete(cur-chelate)
      insert(new-chelate)

*/
// const Con sts = require('../../lib/constants/con sts.js');
// const Criteria = require('./criteria.js');

module.exports = class ChelatePattern {
  constructor(chelate, metaKeys = 'active created form updated') {
    // super();
    // given  chelate: {pk:Aa, sk:Bb, tk:Cc form: {x:Aa,y:Bb,z:Cc,w:D,v:E}}
    // output pattern: {pk:x, sk:y, tk:z }
    // given  chelate: {pk:Aa, sk:BB, tk:CC form: {x:Aa,y:Bb,z:Cc,w:D,v:E}}
    // output pattern: {pk:{att: 'x'}, sk:{const:BB}, tk:{const:CC}} }
    // given  chelate: {pk:Aa, sk:BB, tk:C1e2a form: {x:Aa,y:Bb,z:Cc,w:D,v:E}}
    // output pattern: {pk:{att: 'x'}, sk:{const:BB}, tk:{id:C1e2a}} }
    // this.metaKeys = "active created form updated";
    // this.criteria=null; // pop in setCriteria
    // this.setCriteria(chelate);
    // let pattern = {};
    // needs pk + sk or sk + tk
    // this.keyName = null;

    let isChelate = false;

    /* $lab:coverage:off$ */
    if (chelate.pk && chelate.sk) { isChelate = true; }
    if (chelate.sk && chelate.tk) { isChelate = true; }

    if (!isChelate) {
      throw new Error('Expected a chelate!');
    }
    /* $lab:coverage:on$ */

    // eslint-disable-next-line no-restricted-syntax
    for (const key in chelate) {
      // key is [pk, sk, tk]
      if (!metaKeys.includes(key)) {
        // console.log(key, 'chelate', chelate, chelate[key], typeof(chelate[key]));
        const kv = chelate[key].split('#');
        if (kv[0] === 'const') {
          this[key] = { const: kv[1] };
        } else if (kv[0] === 'guid') {
          this[key] = { guid: kv[1] };
        } else if (chelate.form[kv[0]]) { /* is in form */
          this[key] = { att: kv[0] };
          if (chelate.form[kv[0]] !== kv[1]) {
            // this[key]['keyChanged'] = true;
            this[key].keyChanged = true;
          }
        } else { // # but not in form
          this[key] = { att: kv[0] };
        }
      }
    }
  }

  // getKeyByValue(value, chelateForm) {
  //  /* $lab:coverage:off$ */
  //  this.keyName = null;
  //  // eslint-disable-next-line no-restricted-syntax
  //  for (const key in chelateForm) {
  //    if (chelateForm[key] === value) {
  //      this.keyName = key;
  //    }
  //  }
  //  return this.keyName;
  //  /* $lab:coverage:on$ */
  // }

  hasKeyChange() {
    // when keyChange is added to map then delete and insert
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this) {
      /* $lab:coverage:off$ */
      if (this[key] && this[key].keyChanged) {
        return true;
      }
      /* $lab:coverage:on$ */
    }
    return false;
  }

  getKeyMap() {
    /* E.G.
    {
      pk:{att: "username"},
      sk:{const: "USER"},
      tk:{guid: "*"}        // * is flag to calculate guid when not provided
    }
    */
    const rc = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const k in this) {
      rc[k] = this[k];
    }

    return rc;
  }
};
