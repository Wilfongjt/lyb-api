/*
'use strict';
const Jwt = request('@hapi/jwt');

exports.plugin = {
    pkg: require('../../../package.json'),
    register: async function (server, options) {

        // Create a route for example

        server.route({
            method: 'GET',
            path: '/my_plugin',
            handler: function (request, h) {
              let status = '200';
              let msg = 'OK';
              let result = {};
              let token = '';
              try {
                token = request.headers.authorization.replace('Bearer ','');
                //con sole.log('plugin  keys', Object.keys(request));

                //con sole.log('plugin payload', request.payload);
                //con sole.log('plugin headers', request.headers);
                //con sole.log('plugin authoization', request.headers.authorization);
                //con sole.log('plugin decode', Jwt.token.decode(token));

                result['payload']=request.headers.payload;
                result['msg']='OK';
                result['status']='200';
              } catch (e) {
                console.error('e', e);
              } finally {
                return result;
              }
            }
        });

        // etc...
        //await someAsyncMethods();
    }
};
*/