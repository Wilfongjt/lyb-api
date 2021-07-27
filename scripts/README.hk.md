# Heroku

## Environment Variables
Setup outside of the git repo folder...do not include in repo
```
# ../../../git.config.sh
export DATABASE_URL=<your-heroku-database-url>

```
## install psql (mac)
https://blog.timescale.com/tutorials/how-to-install-psql-on-mac-ubuntu-debian-windows/
```
brew doctor
brew update
brew install libpq
```