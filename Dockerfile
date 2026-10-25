ARG NODE_VERSION=24
ARG PORT=80

FROM node:$NODE_VERSION AS proxyBuild

USER node
WORKDIR /app
COPY proxy /app

ENV NODE_ENV=development
ENV PORT=$PORT

# Currently nothing to build inside
# RUN npm run install
# RUN npm run build
# RUN rm /app/node_modules

###
# Build is done on github so no need for docker build
#FROM node:$NODE_VERSION as frontendBuild
#
#USER node
#WORKDIR /app
#COPY . /app
#
#ENV NODE_ENV=development
#ENV PORT=$PORT
#
#RUN npm install --ignore-scripts
#RUN npm run build

# Prod build
FROM node:$NODE_VERSION

ARG PORT=80

USER node
WORKDIR /app
EXPOSE $PORT
COPY --from=proxyBuild /app ./
COPY build /app/build

ENV NODE_ENV=production
ENV PORT=$PORT

# Keep the process inside the 100M pod limit:
# - MALLOC_ARENA_MAX=2: glibc otherwise grows up to 8 malloc arenas per core and
#   never returns fragmented memory; measured as steady RSS growth outside the JS heap.
# - MALLOC_MMAP_THRESHOLD_ / MALLOC_TRIM_THRESHOLD_: pin glibc's thresholds at their
#   initial 128 KiB. By default glibc raises the mmap threshold to the size of every
#   large block it frees (up to 32 MiB), so after the first page load the multi-MiB
#   buffers of the on-the-fly brotli/gzip compression of app.js & co. are carved out
#   of the heap instead of mmap'ed, and once freed they stay resident as fragmented
#   heap. Measured as a 10-15 MiB RSS step per page-load burst that never came back
#   while the JS heap stayed flat. With fixed thresholds those buffers are mmap'ed
#   and returned to the OS on free; RSS stays flat across bursts.
# - --max-old-space-size=64: V8 picks a ~256 MB heap limit on its own and would let
#   garbage pile up past the container limit before collecting. The live heap is ~11 MB.
ENV MALLOC_ARENA_MAX=2
ENV MALLOC_MMAP_THRESHOLD_=131072
ENV MALLOC_TRIM_THRESHOLD_=131072
ENV NODE_OPTIONS=--max-old-space-size=64

RUN npm ci --ignore-scripts

# Start node directly instead of via npm: the npm wrapper process alone
# costs ~16 MB in the 100M frontend pod
CMD ["node", "server.js"]