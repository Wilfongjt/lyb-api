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
 #cd lb-api/
 # assume this script is in app /script folder
 cd ..
 
 # [* Log into Heroku from script]
 heroku login
 # list your apps
 echo "=== App List ==="
 heroku apps
 echo "=== Git ==="
 git remote --verbose
 
   #filename="../lb-api.hk.delete.sh"
   # [* Do not overwrite heroku application(s)]
   #if [ -f "${filename}" ]; then
   #   # [* Skip heroku app creation when hk.delete.\<app-heroku-app-name\> exists]
   #   echo " - Skipping heroku lb-api create "
   #   echo " - Skipping heroku git create "
   #else
      echo "Creating app: lb-api and repo: lb-api-staging"
 
      if [ $(is_heroku_app "lb-api") = "y" ]; then
        # [* Skip heroku app create when app exists on heroku.com, run lb-api.DELETE.sh to delete app]
        echo "Skipping lb-api"
      else
         echo "Create"
           # [* Create heroku app when app doesnt exist on heroku.com]
           heroku apps:create lb-api -b heroku/nodejs -r "lb-api-staging"
           # [* Create heroku git repo]
           heroku git:remote --app lb-api --remote lb-api # add remote to local git repo
 
           # [* Configure HOST environment variable]
           heroku config:set HOST=0.0.0.0 -a lb-api
           # [* PORT is set by heroku and dosnt need to be set here, but rather determined in the app code]
           # [* configure NODE_ENV environment variable]
           heroku config:set NODE_ENV=production  -a lb-api
      fi
 
      #echo "cd lb-api/" > ${filename}
      #echo "# [# Remove a Specific Heroku Application]" >> ${filename}
      #echo "heroku login" >> ${filename}
      #echo "# [* Login to Heroku from script]" >> ${filename}
      #echo "heroku apps:destroy --app lb-api --confirm lb-api --remote lb-api" >> ${filename}
      #echo "# [* Destroy the app]" >> ${filename}
      #echo "#git remote rm heroku" >> ${filename}
      #echo "# [* Remove the Git heroku repo]" >> ${filename}
      #echo "#git remote rm lb-api" >> ${filename}
      #echo "# [* Remove the Git app repo]" >> ${filename}
      #echo "#git remote rm lb-api-staging" >> ${filename}
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
 
 
