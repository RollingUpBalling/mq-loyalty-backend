FROM node:16.16-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN yarn install --frozen-lockfile

EXPOSE 8080

RUN yarn build

CMD ["yarn", "run", "start:prod"]
