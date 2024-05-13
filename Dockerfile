FROM node:18-alpine

WORKDIR /app

COPY package.json .
RUN yarn install

COPY . .

ARG VITE_DJANGO_URL
ENV VITE_DJANGO_URL=$VITE_DJANGO_URL

RUN yarn run build

EXPOSE 4173

CMD [ "yarn", "run", "preview" ]
