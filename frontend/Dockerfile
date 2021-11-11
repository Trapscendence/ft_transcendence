FROM node:16-alpine3.12

WORKDIR /app

COPY . ./
ENV PATH /app/node_modules/.bin:$PATH
RUN npm i --silent

ENTRYPOINT ["npm"]
CMD ["start"]
