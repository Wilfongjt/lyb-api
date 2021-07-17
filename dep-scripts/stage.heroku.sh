function delete_heroku_app() {
  local my_heroku_app=$1
  heroku apps:destroy --app "$my_heroku_app" --confirm "$my_heroku_app"
}
function get_input()
 {
   # prompt for input
   # $1 is prompt
   # $2 is default value
   local prompt=$1
   local default=$2
   local answer
   prompt+="[${default}]"
   read -p $prompt answer
   if [ "$answer" = "" ]; then
     answer=$default
   fi
   echo $answer
 }

 function is_heroku_app() {
   # check heroku for existance of application
   # $1 is the name of the applicatin to be searched for
   local prj=$1
   local prj_str=$(heroku apps)

   if echo "$prj_str" | grep -q "$prj"; then
     echo "y";
   else
     echo "n";
   fi
 }
# define variables
app_name=""
app_staging_name=""
# [* move to folder with package.json]
cd ..

echo " > login..."
heroku login
echo $(is_heroku_app $app_name)
if [ $(is_heroku_app $app_name) != "y" ]; then
    echo "............"
    echo " > creating"
    exit 1
    heroku apps:create lb-api-staging -r $app_staging
    #heroku apps:create lb-api-staging -b heroku/nodejs  -r lb-api-staging

    echo "............"
    echo " > buildpacks"
    heroku buildpacks:set heroku/nodejs --app lb-api-staging --remote lb-api-staging

    echo "............"

    echo "............"
    echo " > config HOST"
    heroku config:set HOST=0.0.0.0 --app lb-api-staging --remote lb-api-staging

    echo "............"
    echo " > config NPM_CONFIG_PRODUCTION"
    heroku config:set NPM_CONFIG_PRODUCTION=false  --app lb-api-staging --remote lb-api-staging
    echo " > config NPM_CONFIG_PRODUCTION"

    echo "............"
    echo " > config NODE_ENV"
    heroku config:set NODE_ENV=production --app lb-api-staging --remote lb-api-staging

    echo "............"
    echo " > set default remote"
    cd ..
    # to --app lb-api-staging --remote https://git.heroku.com/lb-api-staging.git
    #set git remote heroku to https://git.heroku.com/lb-api-staging.git
    heroku git:remote -a lb-api-staging
fi
echo "............"
echo " > remote repos"
git remote -v

echo " DONE"
