FROM node:lts-alpine

RUN mkdir -p /usr/src/frontend
WORKDIR /usr/src/frontend
COPY . /usr/src/frontend
ENV PATH /usr/src/frontend/node_modules/.bin:$PATH
RUN npm install --silent

CMD ["npm", "start"]
