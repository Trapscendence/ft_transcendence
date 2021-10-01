FROM node

RUN mkdir /usr/src/front
WORKDIR /usr/src/front
COPY . /usr/src/front
ENV PATH /usr/src/front/node_modules/.bin:$PATH
RUN npm install --silent

CMD ["npm", "start"]