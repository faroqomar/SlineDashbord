FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build -w @sline/shared
RUN pnpm run build -w @sline/api

FROM base AS runtime
COPY --from=build /usr/src/app /usr/src/app
WORKDIR /usr/src/app/apps/api
EXPOSE 3001
CMD ["node", "dist/index.js"]
