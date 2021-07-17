FROM node:14.15.1

# set target folder for app
WORKDIR /usr/src/api

# ENV NODE_ENV production
ENV NODE_ENV development

# need only packages to get started
COPY package*.json ./

# update all the packages in node_modules
RUN npm install

# move code from repo to container
COPY . .

EXPOSE 5555

# allow browser connection to docker
CMD ["npm", "dev"]
