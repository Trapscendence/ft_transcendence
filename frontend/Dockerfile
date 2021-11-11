# FROM node:17-alpine3.12
FROM node:lts-alpine3.12

RUN npm install -g npm@8.1.3
WORKDIR /app

COPY . ./
ENV PATH /app/node_modules/.bin:$PATH
RUN npm i

CMD ["npm", "start"]
