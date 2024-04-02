# Dockerfile.buildkit

FROM node:20 as dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

COPY . .
RUN --mount=type=cache,target=./node_modules/.cache/webpack yarn build

FROM bitnami/nginx as prod
COPY --from=dev /app/build/docs /app/docs
COPY nginx/redirect.conf /opt/bitnami/nginx/conf/server_blocks/redirect.conf