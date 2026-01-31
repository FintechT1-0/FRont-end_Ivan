FROM node:18 AS builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN echo "Files in /app before build:" && ls -la /app
RUN npm run build
RUN echo "Files in /app after build:" && ls -la /app

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
