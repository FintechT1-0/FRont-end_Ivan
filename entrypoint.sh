#!/bin/bash
set -e

mkdir -p /var/www/certbot

if [ ! -f /etc/letsencrypt/live/fintecheducation.online/fullchain.pem ]; then
  echo "Requesting Let's Encrypt certificate for fintecheducation.online..."
  certbot certonly --webroot -w /var/www/certbot \
    --non-interactive --agree-tos \
    --email admin@fintecheducation.online \
    -d fintecheducation.online -d www.fintecheducation.online
  echo "Certificate obtained!"
fi


nginx -g "daemon off;"
