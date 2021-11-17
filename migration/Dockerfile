FROM alpine:3.14
RUN apk add npm
WORKDIR /usr/app
RUN npm install -g db-migrate@1.0.0-beta.16 db-migrate-pg
WORKDIR /
COPY ./migrations /migrations
COPY database.json /
COPY entrypoint.sh /

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "up" ]
