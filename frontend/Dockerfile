# FROM node:17-alpine3.12
FROM node:lts-alpine

WORKDIR /app

COPY . ./
ENV PATH /app/node_modules/.bin:$PATH
RUN npm i --silent

CMD ["npm", "start"]
