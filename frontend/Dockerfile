FROM node:17-alpine3.12

WORKDIR /usr/src/frontend

COPY . ./
ENV PATH /usr/src/frontend/node_modules/.bin:$PATH
RUN npm i --silent

CMD ["npm", "start"]
