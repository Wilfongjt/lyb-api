'use strict'
module.exports = class Step {
    constructor(kind, version) {
      this.result = false;
      this.err = false;
      this.sql = 'xxxxx';
      this.kind = kind;
      this.version = version;
      this.name = `${this.kind}_${this.version}`;
    }
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
        // console.log('** Step run', this.kind);
        this.client = client;

        await this.process(client);  
        // console.log('** Step run done');
    
        return this;
      }

      async process(client) {
        // const client = this.client;
        
        // console.log('** Step process in');
        if (!client) {
          console.log('** Step BAD CLIENT');
        }
        //console.log('sql', this.sql); 
        console.log('** ', this.getClassName(), this.getName());
        this.result = await client.query({
          text: this.sql
        }).then(result => {
            this.result = [];
            
            for (let res in result) {
              // console.log('Step', result[res]);
              
              if (result && result[res] && result[res].command && result[res]['command'] === 'SELECT') {
                // console.log('Step', result[res]);
                 // console.log('Step', result[res]['rows']);
                this.result.push(result[res]['rows'])
              }
              
            }
            this.show();
            // console.log('    show', this.result);
        })
        .catch(e => {
            // this.err = e;
            console.log('** Step err', e);
        });
      }

      show() {
        for (let i in this.result) {
          console.log('    ', this.result[i][0]);
        }
      }

}