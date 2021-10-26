FROM alpine:3.14
WORKDIR /usr/app
WORKDIR /
COPY ./migrations /migrations
COPY database.json /
COPY entrypoint.sh /

ENTRYPOINT [ "/entrypoint.sh" ]
