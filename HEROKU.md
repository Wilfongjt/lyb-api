# Heroku Deployment
Heroku Deployment from GitHub

Process 
```
                  *
                  |
                  + <--------- (rebase branch) <------------ +
                  |                                          ^
                  |                                          |
Github         [Version Control] ---> (clone branch) ---> [Development]
                  |   |                                      ^
                  |   |                                      |
                  |   + ------------> (pull branch) -------> +
                  |
               (pull request from branch to main)
                  |   
GitHub Actions [CI/CD]
                  |
Heroku         [Review Deployment]
                  |
               [Staging Deployment]
                  |
               [Production Deployment]   
```

## Prerequisites

1. [GitHub Account](https://github.com)
1. Application Programming Inteface Repository  
1. [Heroku Account](https://id.heroku.com/login)

# Setup
# GitHub Setup 
1. GitHub Actions Workflow

## Heroku Setup
1. Create new app (the API)
1. Connect to GitHub
1. Create Database 
1. Create Database Table
1. Create Database Functions

1. API Settings
    * DATABASE_URL
    * HOST
    * NODE_ENV
    * NPM_CONFIG_PRODUCTION
    * JWT_SECRET
    * JWT_CLAIMS
    * API_TOKEN

## Hobby Heroku Password, Token Updates
1. Update JWT_SECRET then also update API_TOKEN at the same time
   *  Cannot update JWT_SECRET in Hobby, use the syslog_ident value (SHOW ALL;)
1. Update JWT_CLAIMS then also update JWT_SECRET and API_TOKEN 


# Details
### Connect to GitHub
### Create JWT_SECRET 
### Create JWT_CLAIMS 
### Create API_TOKEN 
### Create new app 
### Create Database
### Create Database Table
### Create Database Functions
### DATABASE
### DATABASE_URL
### HOST
### NODE_ENV
### NPM_CONFIG_PRODUCTION
### Update JWT_SECRET (on change, manually create new API_TOKEN )
### Update JWT_CLAIMS (on change, update JWT_SECRET and create new API_TOKEN )
### Update API_TOKEN (on change, update JWT_SECRET)


