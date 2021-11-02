#!/bin/sh
sleep 3
db-migrate $1 ||
  while [ true ]
    do echo 'Error on migration'
    sleep 5
  done