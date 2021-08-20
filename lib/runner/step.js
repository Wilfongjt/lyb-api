'use strict';
module.exports = class Step {
    constructor(kind, version) {
      /* $lab:coverage:off$ */
      this.result = false;
      this.err = false;
      this.sql = 'xxxxx';
      this.kind = kind;
      this.version = version;
      this.name = `${this.kind}_${this.version}`;
      /* $lab:coverage:on$ */
    }
    // $lab:coverage:off$
    setKind(knd) {
      this.kind = knd;
    }
    
    setName(nm) {
      this.name = nm;
    }

    setVersion(vrsn) {
      this.version = vrsn;
    }

    getClassName() {
      return this.constructor.name;
    }

    getName() {
      return this.name;
    }

    async run(client) {
        this.client = client;

        await this.process(client);  
    
        return this;
      }

      async process(client) {

        if (!client) {
          console.log('** Step BAD CLIENT');
        }
        console.log('** ', this.getClassName(), this.getName());
        this.result = await client.query({
          text: this.sql
        }).then(result => {
            this.result = [];
            
            for (let res in result) {
              
              if (result && result[res] && result[res].command && result[res]['command'] === 'SELECT') {
                this.result.push(result[res]['rows']);
              }
              
            }
            this.show();
        })
        .catch(e => {
            // this.err = e;
            console.log('** Step err', e);
        });
      }

      show() {
        /* $lab:coverage:off$ */
        for (let i in this.result) {
          if (this.result[i][0]) {
            console.log('    ',i, this.result[i][0]);
          }
        }
        /* $lab:coverage:on$ */
      }
  // $lab:coverage:on$
};