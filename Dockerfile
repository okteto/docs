# Dockerfile.buildkit

FROM node:21 as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

COPY . .
RUN --mount=type=cache,target=./node_modules/.cache --mount=type=cache,target=./.docusaurus yarn build


FROM bitnami/nginx 
COPY --from=build /app/build/docs /app/docs