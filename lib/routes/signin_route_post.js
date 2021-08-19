'use strict';
const Joi = require('joi');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/signin',
  handler: async function (req) {
    // [Define a /signin POST route handler]
    /* $lab:coverage:off$ */
    let result = {status:"200", msg:"OK"};
    let client ;
    let token ; // guest token
    let form ;
    /* $lab:coverage:on$ */
    const test = req.headers.test || false;
    try {  
      // [Get the API Token from request]
      token = req.headers.authorization; // guest token
      // [Get a database client from request]
      client = req.pg;
      // [Get form from request.params]
      form = req.payload;
      // [Optionally insert a test user when test in header]
      if (test) {
        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');
        // [Insert a transation when test is invoked]
        const resA = await client.query(
          {
            text: 'select * from api_0_0_1.signup($1::TEXT,$2::JSON)',
            values: [token,
                     JSON.stringify(test)]
          }
        );
        console.log('signin add user for test', resA.result);
      }

      // [Get credentials from request]
      const res = await client.query(
        {
          text: 'select * from api_0_0_1.signin($1::TEXT,$2::JSON)',
          values: [token.replace('Bearer ',''),
                   form]
        }
      );

      result = res.rows[0].signin;
      if (test) {
        // [Rollback transaction when when test is invoked]
        await client.query('ROLLBACK');
      }

    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */

      if (test) {
        // [Rollback transacton when excepton occurs and test is invoked]
        await client.query('ROLLBACK');
      }

      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/signin err',err);
      /* $lab:coverage:on$ */
    
    } finally {
      // [Release client back to pool]
      /* $lab:coverage:off$ */
      client.release();
      // [Return {status, msg, token}]
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
        description: 'User Signin with Guest Token',
        notes: 'signin(token, credentials) Returns a {credentials: {username: email}, authentication: {token: JWT} | false }',
        tags: ['api','signin'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
        },
        validate: {
          payload: Joi.object({
            username: Joi.string().min(1).max(20).required(),
            password: Joi.string().min(8).required()
          }),
          headers: Joi.object({
               'authorization': Joi.string().required()
          }).unknown()
        }
    }
};
