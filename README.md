# lyb-api
Goal: Develop a standard secure architecture.
Strategy: Create an application that communicates with a database via a Restful API.
Strategy: Use GitHub Actions to deploy app and api to Heroku.
Strategy: JWT to control access to application and api.

1. Done:  ~~communications between Client and API~~
1. Done: Database (postgres) docker setup
1. Done: Database (postress) herok setup
1. Database implement a review table
1. Database implement a staging table

Start rewrite of this readme

* Create Github Repository
* Clone repo
* Setup Hapi
* Configure docker-compose
* Commit to  Git repository

# lyb-api
A Hapi API
Goal: Create an node API deployed to Heroku
Strategy: Use Hapi api framework

# Overview
1. Github
1. Hapi
1. Docker-Compose
1. Heroku
1. Git Actions           
1. Swagger

## To-do
* Enable a postgres installation in heroku
* Create a staging process for heroku

# Github
1. create a repo to store your Hapi

# Hapi
1. Setup node application
```
mkdir lyb-api
cd lyb-api\
npm init
```

1. Setup hapi api
```
  cd lyb-api\
  npm init
  npm install @hapi/hapi
```

1. Add node packages
```
  cd lyb-api\
  # Development Environment
  npm install dotenv

  # Swagger
  npm install @hapi/hapi
  npm install @hapi/inert
  npm install @hapi/vision
  npm install hapi-swagger

  # JOI Validation
  npm install joi

  # Jest Testing
  npm install jest
```
1. Add a Hapi route
   1. lib/routes/salutaion_route.js
1. Configure CORS
   1. Setup CORS in handler option of route (eg. lib/routes/salutation_route.js)
```
  cors: {
    origin:["*"],
    headers:['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Content-Profile']
  }
```

  1. Setup Development Environment
```
# .env
echo "# lyb-api" > .env
echo "NODE_ENV='developmemt'" >> .env
echo "HAPI='{\"host\":\"0.0.0.0\",\"port\":\"5555\"}'" >> .env
```

## Docker-Compose
Before using docker-compose, build the __dev-swagger-hapi-api__ container
* Manually Build Docker Container
```
#scripts/dk.build.sh
docker build -t dev-swagger-hapi-api --force-rm .
docker images
```
* Start docker-compose
```
docker-compose up
```

## Heroku
1. Manually create heroku app
1. Set GitHub Repository
1. Configure Application Environment
```
# scripts/heroku.config.sh
heroku login
heroku config:set HOST=0.0.0.0 -a lyb-api
heroku config:set NODE_ENV=production  -a lyb-api
heroku config:set NPM_CONFIG_PRODUCTION=false  -a lyb-api
```
1. Manually Add Buildpack heroku/nodejs
1. Setup Heroku Environment

## Git Actions
1. Configure GitHub Actions
   1. .github/workflows/ci_api_staging.yml
1. Configure GitHub secret.HEROKU_API_KEY=\<your heroku key>

## Swagger
* Run swagger to check docker-compose
```
open -a safari http://0.0.0.0:5555/documentation
```
* Run swagger to check heroku install
```
open -a safari https://lyb-api.herokuapp.com/documentation
```
## Issues
<hr/>

1. __Invalid token signature__
  ```
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Invalid token signature",
    "attributes": {
     "error": "Invalid token signature"
    }
  }
  ```
  * __Cause__: Indcates a bad password/secret. This often happens when the JWT_SECRET has changed.  __Solution__: Generate a new token using the updated secret.
2. Route testing isn't working. Cannot connect to database. 
  * route.signin.post.test.js
  * route.signup.post.test.js

## History

1. add eslint and cleanup code
1. disable user routes
1. disable home route
1. disable salutation route
1. disable Joi in lib/server.js
1. enable detection of heroku production environment
1. redirect api home to swagger/documentation
1. need, Database implement a review table
1. need, Database implement a staging table

