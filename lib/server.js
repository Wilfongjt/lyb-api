'use strict';
// [# lyb-api]
console.log('server process.env.NODE_ENV ', process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  // [Load Environment variables when not in production]
  process.env.DEPLOY_ENV=''
  const path = require('path');
  //dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

}
// [Use JWT to control access to API]

// [Use HAPI to implement API]
const Hapi = require('@hapi/hapi');
// [Use JOI to  validate API inputs]
const Joi = require('joi');
// [Use swagger to facilitate manual interaction with API]
const Inert = require('@hapi/inert');
const Vision =  require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');

// [Use HapiPgPoolPlugin to start, create, and disconnect postgres client db connections]

// Data Client
// [Use helper functions to handle configuration]

// application handlers
// [Use a chelate metaphor to handle packing all data objects into a single table]

// [## Define Routes]
// [* salutaion_route]
const salutation_route = require('./routes/salutation_route.js');
//these need to be rewritten to use the /pg_one
// Signup and Sigin RoutesCreate User Route
// Create User Route to demonstrate POST, GET, PUT, and DELETE

// [Initialize Environment]
// [* PORT, Production port is defined on the fly by heroku]
// [* PORT, Non-Production port is defined in {"host":"0.0.0.0","port":"5555"}]
//           heroku              docker
const port = process.env.PORT || 5555;
const host = process.env.HOST || '0.0.0.0';

const server = Hapi.Server({ host: host, port: port});

const swaggerOptions = {
    info: {
            title: 'Test API Documentation',
            version: Pack.version
        },
    };

const registrations = [
  Inert,
  Vision,
  // [Register Swagger Plugin]
  {
      plugin: HapiSwagger,
      options: swaggerOptions
  },
  // [Register JWT Plugin]
  //Jwt,
  // [Register Postgres Connection Pool Plugin]
  /*
  {
    plugin: HapiPgPoolPlugin,
    options: {
      config: {
        user: user_config.user || 'guest_authenticator' || '<username>',
        password: user_config.password || 'guestauthenticatorsecretdatabasepassword' || '<database password>',
        host: database_config.host || 'db' || '<host>',
        database: database_config.database || 'one_db' || '<database>',
        port: database_config.port || 5432 || '<port>',
        guest_token: process.env.API_GUEST_TOKEN  || '<jwt-token>'
      }
    }
  }
  */
];

const api_routes = [
  // [Example Route to API]
  salutation_route
];
/*
const strategy =  function () {
  // [Authorization Strategy]
  return {
    keys: process.env.API_JWT_SECRET,
    verify: {
        aud: JSON.parse(process.env.API_JWT_CLAIMS).aud || '<audience>',
        iss: JSON.parse(process.env.API_JWT_CLAIMS).iss || '<issuer>',
        sub: JSON.parse(process.env.API_JWT_CLAIMS).sub || '<subject>'
    },
    validate: (artifacts, request, h) => {
        if (! artifacts.decoded.payload.user) {
          return {isValid: false}
        }

        if (! artifacts.decoded.payload.scope) {
          return {isValid: false}
        }

        return {
            isValid: true,
            credentials: { user: artifacts.decoded.payload.user, scope: artifacts.decoded.payload.scope }
        };
    }
  }
}
*/
exports.init = async () => {
  console.log('init 1');
  // [Initialize server for testing]
      try {
        await server.register(
          registrations
        );
      // set authentication strategy
      //server.auth.strategy('lb_jwt_strategy', 'jwt', strategy() );
      //server.auth.default('lb_jwt_strategy');
      server.route(api_routes);

      // use for testing
      await server.initialize();
    } catch(e ){
      //console.log('init DATABASE_URL ',process.env.DATABASE_URL);
      console.log('init register ', e);
    } finally {
      /*
      server.table().forEach((route) => {
          console.log(`${route.method}\t${server.info.uri}${route.path}`);
      });
      */
      //console.log('table',server.table());
      return server;
    }
};


// Declare an authentication strategy using the jwt scheme.
// Use keys: with a shared secret key OR json web key set uri.
// Use verify: To determine how key contents are verified beyond signature.
// If verify is set to false, the keys option is not required and ignored.
// The verify: { aud, iss, sub } options are required if verify is not set to false.
// The verify: { exp, nbf, timeSkewSec, maxAgeSec } paramaters have defaults.
// Use validate: To create a function called after token validation.


exports.start = async () => {
  console.log('start 1');

  // [Start server for general use]
    await server.register(
      registrations
    );
    // [Set authorization strategy]
    //server.auth.strategy('lb_jwt_strategy', 'jwt', strategy() );
    //server.auth.default('lb_jwt_strategy');
    // [Load routes]
    server.route(api_routes);
    // starts server for use
    // [Launch the server]
    await server.start();
    // [Give some feedback about routes]
    let swaggered = false;
    //if (process.env.HAPI_ PORT) {
    //if (JSON.parse(process.env.NODE_ENV != 'production')['port']) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('When using docker-compose');
      // server.table().forEach((route) => console.log(`${route.method}\thttp://${process.env.HAPI_ HOST}:${process.env.HAPI_ PORT}${route.path}`));
      server.table().forEach((route) => {
        if (!route.path.includes('swagger')) {
          console.log(`${route.method}\thttp://${host}:${port}${route.path}`);

          //console.log(`${route.method}\thttp://${process.env.HAPI_ HOST}:${process.env.HAPI_ PORT}${route.path}`);
        } else {
          swaggered = true;
        }
      });
    }
    console.log("Otherwise");
    server.table().forEach((route) => {
      if (!route.path.includes('swagger')) {
        console.log(`${route.method}\t${server.info.uri}${route.path}`);
      } else {
        swaggered = true;
      }
    });

    if (swaggered) {
      console.log(`Swagger enabled at /documentation`);
    }
    if (process.env.NODE_ENV !== 'production') {

      console.log('set NODE_ENV=production to turn off')
      for (let ev in process.env) {
        //console.log(ev);
        if (ev.startsWith('LB')) {
          // [No environment variable starting with LB_]
          console.log(ev, process.env[ev]);
        }
        if (ev.startsWith('API')) {
          // [Api environment variables start with API]
          console.log(ev, process.env[ev]);
        }
        if (ev.startsWith('POSTGRES')) {
          // [No environment variables starting with POSTGRES]
          console.log(ev, process.env[ev]);
        }
        if (ev.startsWith('PG')) {
          // [No environment variable starting with PG]
          console.log(ev, process.env[ev]);
        }
      }
    }

    //console.log('user_config.password',user_config.password);
    return server;
};


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

server.events.on('stop', () => {
    // [Stops server when ???]
    //console.log('Server stopped.');
});
