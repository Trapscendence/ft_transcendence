#!/bin/sh

while [ true ]
do
  db-migrate $1 && exit || sleep 1
  echo 'Wait for database initialize ...'
done
