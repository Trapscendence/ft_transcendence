#!/bin/bash

if [ -n "$(certbot certificates 2>/dev/null | grep -e 'No certificates found.' -e 'INVALID')" ]
then
	certbot certonly \
		--standalone \
		--non-interactive \
		--agree-tos \
		-m admin@seheon.email \
		-d ${BACKEND_HOST} \
		-d www.${BACKEND_HOST}
fi

nginx -g 'daemon off;'
