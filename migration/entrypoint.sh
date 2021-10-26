#!/bin/sh
db-migrate up && exit ||
  while [ true ]
    do echo 'Error on migration'
    sleep 5
  done