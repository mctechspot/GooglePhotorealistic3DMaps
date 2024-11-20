FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY . /app
RUN npm install

FROM gcr.io/distroless/nodejs22-debian12
COPY --from=build /app /usr/src/app
WORKDIR /usr/src/app
CMD ["--env-file=.env", "server.mjs"]