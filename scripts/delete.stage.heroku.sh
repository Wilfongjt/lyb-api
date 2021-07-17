function delete_heroku_app() {
  local my_heroku_app=$1

  heroku apps:destroy --app "$my_heroku_app" --confirm "$my_heroku_app" --remote "$my_heroku_app"
  git remote rm "$my_heroku_app"
}
function delete_heroku_repo() {
  local my_heroku_app=$1
  git remote rm "$my_heroku_app"
}
cd ..
echo " > login..."
heroku login

echo " > deleting app..."
#$(delete_heroku_app "lb-api-staging")
git remote rm "lb-api-staging"

echo " > deleting repo..."
#$(delete_heroku_repo "lb-api-staging")
#git remote rm "lb-api-staging"

echo " > show"
#heroku domains --app "lb-api-staging"
git remote -v
echo "DONE"
