cd ..
echo " > login..."
heroku login
git remote -v
heroku repo:reset -a lb-api-staging
