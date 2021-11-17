#!/bin/sh
sleep 5
db-migrate $1 ||
  while [ true ]
    do echo 'Error on migration'
    sleep 5
  done