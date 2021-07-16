'use strict';
//import Joi from 'joi';
const Joi = require('joi');
/* return the time on the database server */
module.exports = {
  // [Route: /time]
  // [Description: Example of calling a function on the database]
  method: 'GET',
  path: '/greet/{name}',
  handler: async function (req,h) {
    // [Define a /time route handler]
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
      result.msg = 'Unknown Error'
      result['error'] = err;
      console.log('/greet err', err)
    } finally {
      // [Return the time as JSON]
      return result;
    }
  },
  options: {
    // [Configure JWT authorization strategy]
    auth: false,
    description: 'API Greet',
    notes: 'Returns the server time.',
    tags: ['api'],
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
