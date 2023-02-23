FROM node:17.6

WORKDIR /usr/src/playlist-app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
WORKDIR /usr/src/playlist-app/frontend
RUN yarn
RUN yarn build
WORKDIR /usr/src/playlist-app
RUN yarn build-container
CMD [ "yarn", "start" ]