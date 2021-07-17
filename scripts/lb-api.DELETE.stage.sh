#cd 01_init_API/
 #cd lb-api/
 cd ..
 #---------------
 # [# Remove a Specific Heroku Application]
 # [* Login to Heroku from script]
 heroku login
 #---------------
 heroku apps
 git remote -v
 #---------------
 #heroku apps:destroy --app "${app}-staging" --confirm "${app}-staging"

   echo "del lb-api"
   # [* Remove the Git repo]
   #git remote rm "lb-api"

   echo "del lb-api-staging"
   # [* Remove the Git Staging repo]
   git remote remove lb-api-staging -f

   echo "del lb-api"
   # [* Destroy the existing app]
   #heroku apps:destroy --app "lb-api" --confirm "lb-api"


 #---------------
 # [* Echo the current list of apps]
 # [* Echo the current list of heroku apps]
 heroku apps
 git remote -v

 # [Open heroku browser]
 open -a safari "https://dashboard.heroku.com/apps"
