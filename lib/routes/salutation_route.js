'use strict';
const Joi = require('joi');
// return a salutaion from the api server
module.exports = {
  // [Route: /salutation]
  // [Description: Example of calling an api ]
  method: 'GET',
  path: '/greet/{name}',
  handler: async function (req) {
    // [Define a /salutaion]
    /* $lab:coverage:off$ */
    let result = {status:"200", msg:"OK"};
    let greet = 'Hello';

    let name_ = 'stranger';
    if (req.params.name && req.params.name !== 'undefined' && req.params.name !== '{name}') {
      name_ = req.params.name;
    }
     
    try {
      result['salutation']= `${greet} ${name_}` ;
    } catch (err) {
      // [Catch any exceptions]
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/greet err', err);
    } finally {
      // [Return the salutaion as JSON]
      // eslint-disable-next-line no-unsafe-finally
      return result;
    }
    /* $lab:coverage:on$ */
  },
  options: {
    // [Configure JWT authorization strategy]
    auth: false,
    description: 'API Greet',
    notes: 'Returns the server time.',
    tags: ['api','salutation'],
    validate: {
            params: Joi.object({
                name: Joi.string()
            }).required()
    },
    cors: {
      origin:["*"],
      headers:['Accept', 'Authorization', 'Access-Control-Allow-Origin', 'Content-Type', 'If-None-Match', 'Content-Profile']
    },
  }
};
