#!/bin/bash
set -e

# Directory for Certbot ACME challenge
mkdir -p /var/www/certbot

# Obtain SSL certificate with Certbot if it doesn't exist
if [ ! -f /etc/letsencrypt/live/fintecheducation.online/fullchain.pem ]; then
  echo "Requesting Let's Encrypt certificate for fintecheducation.online..."
  certbot certonly --webroot -w /var/www/certbot \
    --non-interactive --agree-tos \
    --email admin@fintecheducation.online \
    -d fintecheducation.online -d www.fintecheducation.online
  echo "Certificate obtained!"
fi

# Start Nginx in the foreground
# This keeps the container running without using tail -f
nginx -g "daemon off;"
