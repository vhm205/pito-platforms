FROM node:22-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --production=true

COPY . .

RUN yarn build billing-service

EXPOSE 5001

CMD ["node", "dist/apps/billing-service/src/main"]