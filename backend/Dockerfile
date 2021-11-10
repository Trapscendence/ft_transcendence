FROM node:17-alpine3.12

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm i --silent

COPY . ./

CMD ["npm", "run", "start:dev"]
