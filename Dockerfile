# syntax=docker/dockerfile:1.7-labs

FROM node:20 as dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

COPY --exclude=nginx . .
RUN --mount=type=cache,target=./node_modules/.cache/webpack yarn build

FROM bitnami/nginx as prod
COPY nginx/index.html  /app
COPY --from=dev /app/build/docs /app/docs
