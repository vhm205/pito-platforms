FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --production=true

COPY . .

RUN yarn build user-service

EXPOSE 5003

CMD ["node", "dist/apps/user-service/src/main"]