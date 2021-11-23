FROM alpine:3.14
RUN apk add npm
WORKDIR /usr/app
# RUN npm install -g db-migrate@1.0.0-beta.16 db-migrate-pg
RUN npm install -g db-migrate db-migrate-pg
WORKDIR /
RUN mkdir /migrations
COPY database.json /
COPY entrypoint.sh /
COPY ./migrations /migrations

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "up" ]
