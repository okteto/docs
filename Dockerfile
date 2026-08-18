FROM node:22 AS dev

WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

FROM dev AS build
# Stable and large — cache early
COPY static static
# Changes on version releases
COPY versioned_sidebars versioned_sidebars
COPY versioned_docs versioned_docs
# Config files — occasional changes
COPY sidebarTutorials.js sidebars.js versions.json docusaurus.config.js ./
# Theme/component code — changes less often than content
COPY src/components src/components
COPY src/icons src/icons
COPY src/pages src/pages
COPY src/styles src/styles
COPY src/theme src/theme
COPY src/tutorials src/tutorials
# Content changes most frequently — last so all layers above stay cached
COPY src/content src/content

RUN --mount=type=cache,target=/app/node_modules/.cache/webpack \
    --mount=type=cache,target=/app/.docusaurus \
    yarn build

FROM bitnami/nginx AS prod
COPY nginx/index.html /app
COPY --from=build /app/build/docs /app/docs
