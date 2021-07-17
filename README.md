# lb-ab
Goal: Develop a standard secure architecture.
Strategy: Create an application that communicates with a database via a Restful API.
Strategy: Use GitHub Actions to deploy app and api to Heroku.
Strategy: JWT to control access to application and api.

1. Done: ~~Nuxtjs app client configuration (lb-a)~~
1. Done: ~~lb-a docker-compose setup~~
1. Done: ~~lb-a heroku setup~~
1. Done: ~~lb-a Github Actions setup (GitHub to Heroku)~~
1. Api integration, request POST, GET, UPDATE, DELETE

1. Done: ~~Hapi api configuration (lb-api)~~
1. Done: ~~lb-api docker-compose setup~~
1. Done: ~~lb-a heroku setup~~
1. Done: ~~lb-api Github Actions setup (GitHub to Heroku)~~
1. Database integration, handle POST, GET, PUT, and DELETE requests

1. Done:  ~~communications between Client and API~~
1. Database (postgres) docker setup
1. Database (postress) herok setup
# Docker-Compose
Before using docker-compose, build the __dev-swagger-hapi-api__ container
[dk.build.sh](scripts/dk.build.sh)
```
#scripts/dk.build.sh
docker build -t dev-swagger-hapi-api .
docker images
```

# lb-api
A Hapi API
Goal: Create an node API deployed to Heroku

* 01-init
    * Setup API (lb-api/lb-api)
        * Setup node application
        * Setup hapi api
        * Setup swagger
        * Setup JOI validation
        * Setup Jest testing
    * Configure docker-compose for lb-api
        * Use Swagger to check configuration  (http://0.0.0.0:5555/documentation)
    * Commit to  Git repository

    * Setup Heroku for lb-api
    * Create heroku app (one time)

    * Create heroku app lb-api
    * Configure heroku settings, HOST 0.0.0.0    
    * Configure GitHub Actions for lb-api
    * Configure Actions secret.HEROKU_API_KEY=<your heroku key>


* Commit lb-ab to repo
* Open https://lb-api.herokuapp.com/documentation


## Development Environment
```
echo "# lb-api" > .env
echo "NODE_ENV='developmemt'" >> .env
echo "HAPI='{\"host\":\"0.0.0.0\",\"port\":\"5555\"}'" >> .env

```
## Heroku Environment
```
NODE_ENV='production'
HOST=0.0.0.0
# PORT=Heroku generates a port which is stored in process.env.PORT

```

## Node
## Development Setup
### Hapi

```
  mkdir lb-api
  cd lb-api\
  npm init
  npm install @hapi/hapi

```
### Development Environment
```
npm install dotenv
```

### Swagger
```
npm install @hapi/hapi
npm install @hapi/inert
npm install @hapi/vision
npm install hapi-swagger
```
### JOI Validation
```
npm install joi
```
### Jest Testing
```
npm install jest
```

## Dockerfile
```
FROM node:14.15.1

# set target folder for app
WORKDIR /usr/src/api

# ENV NODE_ENV production
ENV NODE_ENV development

# need only packages to get started
COPY package*.json ./

# update all the packages in node_modules
RUN npm install

# move code from repo to container
COPY . .

EXPOSE 5555

CMD ["npm", "dev"]

```
## Docker-Compose
```
version: '3'
services:
  # ... add following

  lb-api:
      image: dev-swagger-hapi-api
      #build:
      #  context: ./lb-api
      command: >
        sh -c "npm install && npm install nodemon && npm run dev"

      ports:
        - 5555:5555
      environment:
        - NODE_ENV=${NODE_ENV}
        - APP_API=${HAPI}


```

GitHub Actions
* [ci-ab.yml](.github/workflow/ci-ab.yml)

Swagger on Heroku
```
open -a safari https://lb-api.herokuapp.com/documentation
```

CORS
* setup CORS in handler option of route (eg. lib/routes/salutation_route.js)
```
  cors: {
    origin:["*"],
    headers:['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Content-Profile']
  }
```
