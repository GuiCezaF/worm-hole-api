FROM node:20.15.0-alpine

RUN npm i -g pnpm

WORKDIR /www/src

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY .env .
COPY . .

CMD ["pnpm", "start", "dev"]