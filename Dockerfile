# Build context is the MONOREPO ROOT. apps/server depends
# on the workspace package "@tooling/biome" (workspace:^), which only
# resolves when the workspace root (root package.json + tooling/biome) is
# part of the build context — an apps/server-only context makes
# `bun install --frozen-lockfile` fail.
FROM oven/bun:alpine AS base
WORKDIR /usr/src/app
# `prisma generate` (run via postinstall) loads prisma.config.ts, which calls
# env("DATABASE_URL") and fails if the var is unset — even though generate
# never opens a connection. This placeholder only matters at build time;
# the real DATABASE_URL is injected at runtime via environment variables.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
# bun install --frozen-lockfile validates against the FULL workspace, so
# every workspace member's package.json manifest must be present (source is
# not needed for members we don't build here). `tooling` is copied in full
# (small, config-only) since apps/server/tsconfig.json extends
# tooling/typescript/server.json, read by `prisma generate` in the build stage.
COPY package.json bun.lock ./
COPY tooling ./tooling
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/server/package.json ./apps/server/package.json
COPY apps/server/prisma ./apps/server/prisma
COPY apps/server/prisma.config.ts ./apps/server/prisma.config.ts

FROM base AS dev_deps
RUN bun install --frozen-lockfile --filter=server

FROM base AS prod_deps
RUN bun install --frozen-lockfile --production --filter=server

FROM base AS build
COPY --from=dev_deps /usr/src/app/node_modules ./node_modules
COPY --from=dev_deps /usr/src/app/apps/server/node_modules ./apps/server/node_modules
COPY apps/server ./apps/server
WORKDIR /usr/src/app/apps/server
# apps/server/src/generated/prisma is gitignored (not part of the build
# context) and was already generated once by postinstall in the `base`
# install stages — but COPY apps/server above overwrites it with the host
# copy, which lacks it. Regenerate so the bundle below has the client.
RUN bun run db:generate
RUN bun run build

# Packages are kept external during the build (see scripts/build.ts) because
# some native deps (e.g. pg) resolve a platform binary via a runtime
# require that only works from their real node_modules location — so
# node_modules has to ship alongside dist/ at runtime.
FROM base AS release
COPY --from=prod_deps /usr/src/app/node_modules ./node_modules
# `bun install --filter=server` puts workspace-scoped bin symlinks (e.g.
# node_modules/.bin/prisma, needed by `bun run db:deploy`) under
# apps/server/node_modules rather than the hoisted root node_modules — both
# are required at runtime.
COPY --from=prod_deps /usr/src/app/apps/server/node_modules ./apps/server/node_modules
COPY --from=build /usr/src/app/apps/server/dist ./apps/server/dist
# dist/main.js is a self-contained bundle, but prisma/seed.ts (run directly by
# `bun run db:seed`, not bundled) imports the generated client via a relative
# path — ship it too.
COPY --from=build /usr/src/app/apps/server/src/generated ./apps/server/src/generated
WORKDIR /usr/src/app/apps/server
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE ${PORT}
CMD ["bun", "dist/main.js"]
