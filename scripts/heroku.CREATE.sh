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
 
 #cd 01_init_API/
 #cd lyb-api/
 # assume this script is in app /script folder
 cd ..
 
 # [* Log into Heroku from script]
 heroku login
 # list your apps
 echo "=== App List ==="
 heroku apps
 echo "=== Git ==="
 git remote --verbose
 
   #filename="../lyb-api.hk.delete.sh"
   # [* Do not overwrite heroku application(s)]
   #if [ -f "${filename}" ]; then
   #   # [* Skip heroku app creation when hk.delete.\<app-heroku-app-name\> exists]
   #   echo " - Skipping heroku lyb-api create "
   #   echo " - Skipping heroku git create "
   #else
      #echo "Creating app: lyb-api and repo: lyb-api-staging"
      echo "Creating app: lyb-api"
 
      if [ $(is_heroku_app "lyb-api") != "y" ]; then
        # [* Skip heroku app create when app exists on heroku.com, run lyb-api.DELETE.sh to delete app]
        # echo "Skipping lyb-api"
        echo "Manually Create lyb-api"
 
      else
         echo "Create and set buildpack"
         # [* Create heroku app when app doesnt exist on heroku.com]
         # heroku apps:create lyb-api -b heroku/nodejs -r "lyb-api-staging"
         # heroku apps:create lyb-api -b heroku/nodejs -r "lyb-api"
 
         #heroku apps:create lyb-api -b heroku/nodejs
 
         #git remote add heroku https://git.heroku.com/[[app-project]].git
         #heroku git:remote -a lyb-api
 
         # [* Create heroku git repo]
         echo "---------- git:remote"
         #heroku git:remote --app lyb-api --remote lyb-api # add remote to local git repo
 
         #echo "---------- remote rename"
         #git remote rename heroku lyb-api
 
         # [* Configure HOST environment variable]
         echo "---------- config HOST"
         #heroku config:set HOST=0.0.0.0 -a lyb-api
 
         # [* PORT is set by heroku and dosnt need to be set here, but rather determined in the app code]
         # [* configure NODE_ENV environment variable]
         echo "---------- config NODE_ENV"
         #heroku config:set NODE_ENV=production  -a lyb-api
 
         echo "---------- config NPM_CONFIG_PRODUCTION"
         #heroku config:set NPM_CONFIG_PRODUCTION=false  -a lyb-api
 
         # [* configure ]
         #echo "---------- config HOST"
         #heroku config:set NODE_ENV=production  -a lyb-api
 
         echo "---------- remote rename"
         #git remote rename heroku lyb-api-staging
 
      fi
 
      #echo "cd lyb-api/" > ${filename}
      #echo "# [# Remove a Specific Heroku Application]" >> ${filename}
      #echo "heroku login" >> ${filename}
      #echo "# [* Login to Heroku from script]" >> ${filename}
      #echo "heroku apps:destroy --app lyb-api --confirm lyb-api --remote lyb-api" >> ${filename}
      #echo "# [* Destroy the app]" >> ${filename}
      #echo "#git remote rm heroku" >> ${filename}
      #echo "# [* Remove the Git heroku repo]" >> ${filename}
      #echo "#git remote rm lyb-api" >> ${filename}
      #echo "# [* Remove the Git app repo]" >> ${filename}
      #echo "#git remote rm lyb-api-staging" >> ${filename}
      #echo "# [* Remove the Git Staging repo]" >> ${filename}
      #echo "heroku apps" >> ${filename}
      #echo "# [* Echo the current list of apps]" >> ${filename}
      #echo "git remote -v" >> ${filename}
      #echo "# [* Echo the current list of heroku apps]" >> ${filename}
 
      #chmod 755 ${filename}
 
   #fi
 #---------------
 # [* Echo the current list of apps]
 heroku apps
 
 # [* Echo the current list of heroku git repos]
 git remote -v
 
 # [Open heroku browser]
 open -a safari "https://dashboard.heroku.com/apps"
 
 
