#cd 01_init_API/
 #cd lb-api/
 # assume we are in subfolder of project repo
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
 

 
   echo "heroku releases"
   # [* Destroy the existing app]
   heroku releases -a lb-api-staging
 
 
 #---------------
 # [* Echo the current list of apps]
 # [* Echo the current list of heroku apps]
 heroku apps
 git remote -v
 
 # [Open heroku browser]
 open -a safari "https://dashboard.heroku.com/apps"
 
