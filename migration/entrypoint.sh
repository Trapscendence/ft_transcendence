#!/bin/sh
apk add npm
npm install -g db-migrate db-migrate-pg
db-migrate up && exit ||
  while [ true ]
    do echo 'Error on migration'
    sleep 5
  done