# FROM node:17-alpine3.12
FROM node:16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . ./

ENTRYPOINT ["npm"]
CMD ["run", "start:dev"]
