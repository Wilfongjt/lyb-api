/* eslint-disable no-undef */
// 'use strict';
// const process = require('process');
// [# lyb-api API]
/* $lab:coverage:off$ */
if (process.env.NODE_ENV !== 'production') {
  // NPM_CONFIG_PRODUCTION is only set in production environment
  if (!('NPM_CONFIG_PRODUCTION' in process.env)) {
    // eslint-disable-next-line no-console
    console.log('server dotenv 1');
    // [* Load Environment variables when not in production]
    process.env.DEPLOY_ENV = '';
    // eslint-disable-next-line global-require
    const path = require('path');
    // eslint-disable-next-line
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  }
}
/* $lab:coverage:on$ */
// [## Use]
// [* Use JWT to control access to API]
const Jwt = require('@hapi/jwt')

// [* Use HAPI to implement API]
const Hapi = require('@hapi/hapi');

// [* Use swagger to facilitate manual interaction with API]
const Inert = require('@hapi/inert');
const Vision =  require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');

// [* Use HapiPgPoolPlugin to start, create, and disconnect postgres client db connections]
const HapiPgPoolPlugin = require( './plugins/postgres/hapi_pg_pool_plugin.js');

// [* Use root_route]
const home_route = require('./routes/home_route.js');

// [* Use salutaion_route]
//const salutation_route = require('./routes/salutation_route.js');

// [* Use time_route]
const time_route = require('./routes/time_route.js');

// [* Use Signin Route]
const signin_route = require('./routes/signin_route_post.js');

// [* Use Signup Route]
const signup_route = require('./routes/signup_route_post.js');

// [## Configure]

// [* Database Configuration Docker Dev eg. '{"host":"db","port":5432,"database":"pg_db"}']
// [* Database Configuration Heroku Prod eg. '{"host":"0.0.0.0","database":"<get db name from heroku>"}']

// [* PORT, Production port is defined on the fly by heroku]
// [* PORT, Non-Production port is defined in {"host":"0.0.0.0","port":"5555"}]
//           heroku              docker

/* $lab:coverage:off$ */
const jwt_claims = {"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"guest", "scope":"api_guest", "key":"0"};

const port = process.env.PORT || 5555;

// [* HOST Configuration]
const host = process.env.HOST || '0.0.0.0';

// [## Start Hapi Server]
const server = Hapi.Server({ host: host, port: port});

/* $lab:coverage:on$ */

// [* Swagger Configuration]
const swaggerOptions = {
  info: {
          title: 'Test API Documentation',
          version: Pack.version
      },
  };

// [Hapi Registration Configuration]
const registrations = [
  Inert,
  Vision,
  // [Register Swagger Plugin]
  {
      plugin: HapiSwagger,
      options: swaggerOptions
  },
  // [Register JWT Plugin]
  Jwt,
  // [Register Postgres Connection Pool Plugin]
  {
    plugin: HapiPgPoolPlugin,
    options: {
      config: {
        /* $lab:coverage:off$ */
        database_url: process.env.DATABASE_URL || '<database-url>',
        guest_token:  process.env.API_TOKEN || '<undefined-jwt-token>',
        node_env: process.env.NODE_ENV,
        /* $lab:coverage:on$ */
      }
    }
  }
  
];
// [* Route Configuration]
const api_routes = [
  // [* Home Route Configuration]
  home_route,
  // [* Salutation Route Configuration]
  //salutation_route,
  // [* Time Route Configuration, Get the database time]
  time_route,
  // [* Signin Route Configuration, Login]
  signin_route,
  // [* Signup Route Configuration, Create Account]
  signup_route
];

const strategy =  function () {
  // [* Authorization JWT Strategy Configuration]
  //let claims = process.env.JWT_ CLAIMS; 
  //let jwt_claims = {"aud":"lyttlebit-api", "iss":"lyttlebit", "sub":"client-api", "user":"guest", "scope":"api_guest", "key":"0"};
  //con sole.log('strategy JWT_SECRET', process.env.JWT_SECRET);
  return {
    keys: process.env.JWT_SECRET,
    verify: {
        /* $lab:coverage:off$ */
        aud: jwt_claims.aud || '<audience>',
        iss: jwt_claims.iss || '<issuer>',
        sub: jwt_claims.sub || '<subject>'
        /* $lab:coverage:on$ */
    },
    validate: (artifacts) => {
        /* $lab:coverage:off$ */

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
        /* $lab:coverage:on$ */
    }
  }
}

exports.init = async () => {
  // [* Start server for testing]
  // con sole.log('[* Start server for testng] 1');

    //try {
        await server.register(
          registrations
        );
      // set authentication strategy
      server.auth.strategy('lb_jwt_strategy', 'jwt', strategy() );
      server.auth.default('lb_jwt_strategy');      
      server.route(api_routes);

      // use for testing
      await server.initialize();
    
      //} catch(e){
      /* $lab:coverage:off$ */
      //console.error('init register ', e);
      /* $lab:coverage:on$ */
    //} finally {
      /*
      for (let ev in process.env) {

        if (!/[a-z]/.test(ev) && /[A-Z]/.test(ev)) {
          if (ev.includes('SECRET') 
              || ev.includes('PASSWORD')
              || ev.includes('DATABASE_URL')) {
              console.log(ev, '********');
          } else {
            console.log(ev, process.env[ev]);
          }
        }
        
      }
      */
      return server;
    //}
  };


// Declare an authentication strategy using the jwt scheme.
// Use keys: with a shared secret key OR json web key set uri.
// Use verify: To determine how key contents are verified beyond signature.
// If verify is set to false, the keys option is not required and ignored.
// The verify: { aud, iss, sub } options are required if verify is not set to false.
// The verify: { exp, nbf, timeSkewSec, maxAgeSec } paramaters have defaults.
// Use validate: To create a function called after token validation.


exports.start = async () => {
  /* $lab:coverage:off$ */
  // [* Start server for general use]
   // con sole.log('[* Start server for general use] 1');

    await server.register(
      registrations
    );
    // [Set authorization strategy]
    server.auth.strategy('lb_jwt_strategy', 'jwt', strategy() );
    server.auth.default('lb_jwt_strategy');
    // [Load routes]
    server.route(api_routes);
    // starts server for use
    // [Launch the server]
    await server.start();

    // [Give some feedback about routes]
    let swaggered = false;
  
    if (process.env.NODE_ENV !== 'production') {
      console.log('When using docker-compose');
      server.table().forEach((route) => {
        if (!route.path.includes('swagger')) {
          console.log(`${route.method}\thttp://${host}:${port}${route.path}`);
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
    
      /*
      for (let ev in process.env) {

        if (!/[a-z]/.test(ev) && /[A-Z]/.test(ev)) {
          if (ev.includes('SECRET') 
              || ev.includes('PASSWORD')
              || ev.includes('DATABASE_URL')) {
              console.log('* lib/server.js ',ev, '********');
          } else {
            console.log('* lib/server.js',ev, process.env[ev]);
          }
        }
      }
      */
      
    
    console.log('[* Start server for general use] ok');

    return server;
    /* $lab:coverage:on$ */
};


process.on('unhandledRejection', (err) => {
    /* $lab:coverage:off$ */
    console.error(err);
    process.exit(1);
    /* $lab:coverage:on$ */
});

server.events.on('stop', () => {
    // [Stops server when ???]
    //console.log('Server stopped.');
});
