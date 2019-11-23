# Use Node v8 LTS base image
FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# bundle app source
COPY . .

RUN npm run build
RUN rm tsconfig.json
#RUN npm uninstall dev-dependencies
RUN npm prune --production

EXPOSE 8100

CMD [ "npm", "start" ]

