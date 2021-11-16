#!/bin/sh
apk add npm
npm install -g db-migrate db-migrate-pg
sleep 3
# db-migrate $1 ||
  # while [ true ]
    # do echo 'Error on migration'
    # sleep 5
  # done
db-migrate $1