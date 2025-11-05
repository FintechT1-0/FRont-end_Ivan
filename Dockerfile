FROM node:18 AS builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN echo "Files in /app before build:" && ls -la /app
RUN npm run build
RUN echo "Files in /app after build:" && ls -la /app

FROM nginx:alpine

RUN apk add --no-cache certbot certbot-nginx bash curl
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
