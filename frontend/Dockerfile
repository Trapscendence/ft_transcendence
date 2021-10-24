FROM node:fermium-alpine

WORKDIR /usr/src/frontend

COPY . ./
ENV PATH /usr/src/frontend/node_modules/.bin:$PATH
RUN npm i --silent

CMD ["npm", "start"]
