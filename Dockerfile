FROM node:14.19.1

WORKDIR /usr/src/app
COPY . .
RUN yarn install
RUN yarn build
CMD ["yarn", "start"]