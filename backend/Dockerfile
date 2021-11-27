FROM node:17

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . ./

ENTRYPOINT ["./entrypoint.sh"]
CMD ["run", "start:dev"]
