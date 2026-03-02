FROM node:20-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build -w @sline/shared
RUN pnpm run build -w @sline/admin-ui

FROM nginx:alpine
COPY --from=build /usr/src/app/apps/admin-ui/dist /usr/share/nginx/html
# Add custom nginx config for SPA routing if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
