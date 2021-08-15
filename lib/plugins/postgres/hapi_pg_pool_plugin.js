// 'use strict';

const { Pool } = require('pg')

//const pool = new DbFactory(config); // warm up the pool
const pools = {};
let run_once = false;
const PG_CON = []; // this "global" is local to the plugin.

exports.plugin = {
    pkg: require('../../../package.json'),
    version: '1.0.0',

    register: async function (server) {
      // [# Hapi Postgres Client Pool Plugin]
      // [Description: Create several database connections to speed things up.]

       server.ext({
         type: 'onPreAuth',
         method: async function (request, h) {

           try {
              /* $lab:coverage:off$ */
              if (!('pool' in pools)) {
                 // [* Initialize connection pool with databse_url config]    
                 const connectionString = h.realm.pluginOptions.config.database_url;  
                 const node_env = h.realm.pluginOptions.config.node_env;
                 //con sole.log('database_url',h.realm.pluginOptions.config.database_url);         
                 if (connectionString) {
                    const conn_config = {
                      connectionString: connectionString,
                      ssl: {
                        sslmode: 'require',
                        rejectUnauthorized: false,
                      }
                    };
                    // if (process.env.NODE_ENV !== 'production') {
                    
                    if (node_env !== 'production') {
                      // [* Remove SSL when NODE_ENV !== production]
                      delete conn_config['ssl'];
                    }

                    pools['pool'] = new Pool(conn_config);

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
                                 //console.log('disconnecting');
                                 await con.client.end();
                                 //console.log('disconnected');
                               });
                 });

               }
              /* $lab:coverage:on$ */

           } catch(err) {
            /* $lab:coverage:off$ */
             console.error('!!! MAKE SURE DATABASE IS RUNNING!!! A')
            /* $lab:coverage:on$ */
            } finally {
             // eslint-disable-next-line no-unsafe-finally
             return h.continue;
           }
         }
       });
     }

};

