#!/bin/bash
source ./lib.get_input.sh
source ../../../git.config.sh

export DATABASE_URL=$(get_input "Database_URL" "${DATABASE_URL}")

heroku pg:info --app lyb-api
