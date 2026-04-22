FROM node:22 AS dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

FROM dev AS build
COPY versioned_sidebars versioned_sidebars
COPY versioned_docs versioned_docs
COPY sidebarTutorials.js sidebars.js versions.json docusaurus.config.js ./
COPY static static
COPY src src

RUN --mount=type=cache,target=./node_modules/.cache/webpack yarn build

FROM bitnami/nginx AS prod
COPY nginx/index.html  /app
COPY --from=build /app/build/docs /app/docs
