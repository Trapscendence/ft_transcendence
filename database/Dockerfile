FROM  postgres:14
LABEL maintainer="ezemango@gmail.com"
ARG   DB_USER \
      DB_PASSWORD \
      POSTGRES_PASSWORD \
      PGDATA \
      DB_NAME
RUN   echo " \
        CREATE ROLE ${DB_USER} WITH LOGIN CREATEDB PASSWORD '${DB_PASSWORD}'; \
        CREATE DATABASE ${DB_NAME}; \
        CREATE SCHEMA ${DB_NAME}; \
        GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER}; \
        " > /docker-entrypoint-initdb.d/set_user.sql