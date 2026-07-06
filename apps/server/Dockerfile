FROM oven/bun:alpine AS base
WORKDIR /usr/src/app
COPY package.json bun.lockb ./
COPY prisma ./prisma
COPY prisma.config.ts ./

FROM base AS dev_deps
RUN bun install --frozen-lockfile

FROM base AS prod_deps
RUN bun install --frozen-lockfile --production

FROM base AS build
COPY --from=dev_deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run build

# Packages are kept external during the build (see scripts/build.ts) because
# some native deps (e.g. libsql) resolve a platform binary via a runtime
# require that only works from their real node_modules location — so
# node_modules has to ship alongside dist/ at runtime.
FROM base AS release
COPY --from=prod_deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
ENV PORT=3000
EXPOSE ${PORT}
CMD ["bun", "run", "start:prod"]