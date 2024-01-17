ARG DENO_VERSION=1.39.4

FROM denoland/deno:bin-$DENO_VERSION AS deno

ENV DENO_INSTALL=/deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/typescript-node:20-bookworm

COPY --from=deno /deno /usr/local/bin/deno

RUN pnpm config set store-dir /home/node/pnpm/store
