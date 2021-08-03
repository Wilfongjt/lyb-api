'use strict';
const { Pool, Client } = require('pg')

//const connectionString = 'postgresql://dbuser:secretpassword@db:3211/mydb';
//PG USER
//PG PASSWORD
//PG PORT
//PG DATABASE
/*
const config = {
  user: process.env.PG USER || 'postgresx',
  host: process.env.PG HOST || 'dbx',
  database: process.env.PG DATABASE || 'one_dbx',
  password: process.env.PG PASSWORD || 'mysecretdatabasepasswordx',
  port: process.env.PG PORT || 5433,
  guest_token: process.env.API _GUEST_TOKEN,
  Client: Client
};
*/
//const pool = new DbFactory(config); // warm up the pool
const pools = {};
let run_once = false;
const PG_CON = []; // this "global" is local to the plugin.

exports.plugin = {
    pkg: require('../../../package.json'),
    version: '1.0.0',

    register: async function (server) {
      // [Hapi Postgres Client Pool Plugin]
      // [Description: Create several database connections to speed things up.]
       // connection using created pool

       server.ext({
         type: 'onPreAuth',
         method: async function (request, h) {
          console.log('hapi_pg_pool_plugin 1');

           try {
              /* $lab:coverage:off$ */
              if (!('pool' in pools)) {
                 // [Initialize connection pool with databse_url config]    
                 let connectionString = h.realm.pluginOptions.config.database_url;           
                 if (connectionString) {
                    pools['pool'] = new Pool({
                      connectionString,
                    });
                  } 
               }

               if (request.route.settings.auth) {
                  // [Retrieve a client connection from pool When authenticated]                 
                  let client  = await pools.pool.connect();
                  PG_CON.push({ client });
                  request.pg = client;
               }

               if(!run_once) {

                 run_once = true;

                 server.events.on('stop', async function () { // only one server.on('stop') listener
                   // [Register handler to close connections when app is shutdown/stopped]

                   PG_CON.forEach(async function (con) { // close all the connections
                                 console.log('disconnecting');
                                 await con.client.end();
                                 console.log('disconnecting ok');

                               });
                 });

               }
              /* $lab:coverage:on$ */

           } catch(err) {
            /* $lab:coverage:off$ */

             console.log('HapiPgPoolPlugin err1 ', err);
             console.log('hapiPgPoolPlugin POOL err2 ', pools);
            /* $lab:coverage:on$ */

            } finally {
             return h.continue;
           }
         }
       });
     }

};

