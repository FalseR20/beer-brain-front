FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

ARG VITE_DJANGO_URL
ENV VITE_DJANGO_URL=$VITE_DJANGO_URL

RUN npm run build

EXPOSE 4173

CMD [ "npm", "run", "preview" ]
