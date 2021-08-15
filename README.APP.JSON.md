# app.json
```
{
  "name": "lyb-api",
  "description": "Lyb-Api is a single table api.",
  "scripts": {
    "postdeploy": "bundle exec rake db:schema:load data:load_things"
  },
  "scripts": {
    "postdeploy": "node models/table.js"
  },
  "env": {
    "GOOGLE_MAPS_JAVASCRIPT_API_KEY": {
      "required": true
    },
    "HEROKU_APP_NAME": {
      "required": true
    },
    "LANG": {
      "required": true
    },
    "RACK_ENV": {
      "required": true
    },
    "RAILS_ENV": {
      "required": true
    },
    "RAILS_SERVE_STATIC_FILES": {
      "required": true
    },
    "SECRET_KEY_BASE": {
      "generator": "secret"
    },
    "DEVISE_SECRET": {
      "generator": "secret"
    },
    "DW_AUTH_TOKEN": {
      "required": true
    },
    "DW_USER": {
      "required": true
    },
    "OPEN_SOURCE": {
      "required": true
    }
  },
  "addons": [
    "airbrake",
     {
      "plan": "heroku-postgresql",
      "options": {
        "version": "13.3"
      }
    },
    "sendgrid"
  ],
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
```

# Addons

* [airbrake](DETAILS.md#airbrake)

* [heroku-postgresql](DETAILS.md#heroku-postgresql)

* [sendgrid](DETAILS.md#sendgrid)

* [postdeploy](DETAILS.md#postdeploy)