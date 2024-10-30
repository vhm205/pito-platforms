FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --production=true

COPY . .

RUN yarn build api-gateway

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/src/main"]