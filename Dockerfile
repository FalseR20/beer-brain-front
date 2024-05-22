FROM node:18-alpine as build

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .

ARG VITE_DJANGO_URL
ENV VITE_DJANGO_URL=$VITE_DJANGO_URL

RUN yarn run build

FROM nginx:1.18-alpine as main

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

# Копируем сгенерированные файлы из стадии сборки в Nginx
COPY --from=build /app/dist /usr/share/nginx/html/

# Указываем порт, который будет использоваться для сервера
EXPOSE 4173

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
