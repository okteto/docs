FROM node:22 AS dev

WORKDIR /app

COPY package.json yarn.lock ./
# `yarn install` applies these patches (patch-package, in postinstall)
COPY patches patches
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

FROM dev AS build
# The build context has no .git (.dockerignore), so the build can't read the
# last update dates of the pages from Git (see config/shared.js)
ENV DOCUSAURUS_VCS=disabled
# Every image build starts from scratch: the persistent cache of Rspack only
# adds a cache to restore, and it broke the JavaScript of the docs
ENV DOCUSAURUS_NO_PERSISTENT_CACHE=true
# Stable and large — cache early
COPY static static
COPY shared shared
# Changes on version releases
COPY versioned_sidebars versioned_sidebars
COPY versioned_docs versioned_docs
# Config files — occasional changes
COPY sidebars.js versions.json docusaurus.config.js docusaurus.tutorials.config.js docusaurus.blog.config.js ./
COPY config config
COPY scripts scripts
# Theme/component code — changes less often than content
COPY src/clientModules src/clientModules
COPY src/components src/components
COPY src/icons src/icons
COPY src/plugins src/plugins
COPY src/pages src/pages
COPY src/styles src/styles
COPY src/theme src/theme
# Content changes most frequently — last so all layers above stay cached
COPY src/content src/content
COPY tutorials tutorials
COPY blog blog

RUN --mount=type=cache,target=/app/node_modules/.cache/webpack \
    --mount=type=cache,target=/app/.docusaurus \
    --mount=type=cache,target=/app/.docusaurus-blog \
    --mount=type=cache,target=/app/.docusaurus-tutorials \
    yarn build

FROM bitnami/nginx AS prod
COPY nginx/index.html /app
COPY --from=build /app/build/docs /app/docs
COPY --from=build /app/build/tutorials /app/tutorials
COPY --from=build /app/build/blog /app/blog
