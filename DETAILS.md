# Details
Details is a master list of useful project information.

# Index

> [Architecture](#architecture)

> [Configuration Settings](#configuration-settings)

> [Platforms](#platforms)

> [Processes](#processes )

# Addons

* # airbreak
    [airbrake](https://airbrake.io) is application monitoring

* # heroku-postgresql
    [heroku-postgresql](https://elements.heroku.com/addons/heroku-postgresql) is a database

* # sendgrid
    [sendgrid](https://sendgrid.com) is an email api

# Architecture
```
[App] <---> [API] <---> [Database]
```

* ## Application (App)
* ## Application Programming Interface (API)
* ## Database (DB) 

# Configuration Settings

* ## API_TOKEN
* ## DATABASE_URL
* ## HOST
* ## JWT_SECRET
* ## JWT_CLAIMS
* ## NODE_ENV
* ## NPM_CONFIG_PRODUCTION
* ## PORT 
* ## postdeploy
* ## POSTGRES_DB
* ## POSTGRES_USER
* ## POSTGRES_PASSWORD
* ## POSTGRES_JWT_SECRET
* ## POSTGRES_API_PASSWORD
* ## POSTGRES_JWT_CLAIMS

# Platforms

* ## GitHub (GH)
* ## Heroku (HK)

# Processes 

* ## Connect to GitHub
* ## Create Database
* ## Create JWT_CLAIMS 
* ## Create JWT_SECRET 
* ## Create API_TOKEN for Development
    Use a python script to generate development token 
    ```
    # eg
    
    import uuid
    import jwt

    def main():
        # claim is same as POSTGRES_JWT_CLAIMS and JWT_CLAIMS
        claim = {"aud":"lyttlebit-api", 
                 "iss":"lyttlebit", 
                 "sub":"client-api", 
                 "user":"guest", 
                 "scope":"api_guest", 
                 "key":"0"}
        password = str(uuid.uuid4())
        # go get the from syslog_ident from heroku postgres (SHOW ALL;)
        password = 'PASSWORDmustBEATLEAST32CHARSLONGLONG'
        jwt_token = jwt.encode(claim, password, algorithm="HS256")

        print('claim', claim)
        print('password: ', password)
        print('Bearer', jwt_token)

    if __name__ == "__main__":
        main()
    ```
* ## Create API_TOKEN for Production
    Use a python script to generate production token 
    ```
    # eg
    
    import uuid
    import jwt

    def main():
        # claim is same as POSTGRES_JWT_CLAIMS and JWT_CLAIMS
        claim = {"aud":"lyttlebit-api", 
                 "iss":"lyttlebit", 
                 "sub":"client-api", 
                 "user":"guest", 
                 "scope":"api_guest", 
                 "key":"0"}
        password = str(uuid.uuid4())
        # go get the from syslog_ident from heroku postgres (SHOW ALL;)
        password = 'xe5d9645_302a_493d_b9de_207dxa16ba9b'
        jwt_token = jwt.encode(claim, password, algorithm="HS256")

        print('claim', claim)
        print('password: ', password)
        print('Bearer', jwt_token)

    if __name__ == "__main__":
        main()
    ```
* ## Create API for Development
* ## Create API for Production
* ## Create Database for Development
* ## Create Database for Production
* ## Create Database Table for Development
* ## Create Database Table for Production
* ## Create Database Functions for Development
* ## Create Database Functions for Production
* ## Create GitHub Actions
* ## Create GitHub Repository
* ## Update GitHub Repository
* ## Update API_TOKEN 
    * On change, update JWT_SECRET
* ## Update JWT_CLAIMS 
    * On change, update JWT_SECRET and create new API_TOKEN 
* ## Update JWT_SECRET 
    * On change, manually create new API_TOKEN 
