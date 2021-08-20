'use strict';
const Joi = require('joi');

/* return the time on the database server */
module.exports = {
  // [Route: /time]
  // [Description: Example of calling a function on the database]
  method: 'GET',
  path: '/time',
  handler: async function (req) {
    // [Define a /time route handler]
    /* $lab:coverage:off$ */

    let result = {status:"200", msg:"OK"};
    let client ;
    /* $lab:coverage:on$ */

    try {

      if (! req.pg) {
        throw 'Client not found in request.';
      }
      // [Get a database client]
      client = req.pg;
      // [Query the time]
      let res = await client.query(
        {
          text: 'select * from api_0_0_1.time()'
        }
      );
      result = res.rows[0].time;
    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */

      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/time err', err);
      /* $lab:coverage:on$ */
    } finally {
      // [Release the client back to the pool]
      /* $lab:coverage:off$ */
      if (client) {
        client.release();
      }  else {
        console.error('time_route missing client');
      }
      // [Return the time as JSON]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      /* $lab:coverage:on$ */
    }
  },
  options: {
    cors: {
      origin:["*"],
      headers:['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Content-Profile']
    },
    description: 'API Time',
    notes: 'Returns the server time.',
    tags: ['api','time'],
    // [Configure JWT authorization strategy]
    auth: {
      mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
    },
    validate: {
      headers: Joi.object({
           'authorization': Joi.string().required()
      }).unknown()
    }
    
  }
};
