FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY assets ./assets
COPY controllers ./controllers
COPY helpers ./helpers
COPY libs ./libs
COPY models ./models
COPY routes ./routes
COPY runners ./runners
COPY utils ./utils

COPY index.js ./index.js
COPY docker/package.json ./package.json
COPY docker/package-lock.json ./package-lock.json

RUN npm install
EXPOSE 4000

CMD [ "npm", "run", "start" ]