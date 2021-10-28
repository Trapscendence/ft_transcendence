FROM alpine:3.14
RUN apk add npm
WORKDIR /usr/app
RUN npm install -g db-migrate db-migrate-pg
WORKDIR /
RUN mkdir /migrations
COPY ./migrations /migrations
COPY database.json /

ENTRYPOINT [ "db-migrate" ]
CMD [ "up" ]
