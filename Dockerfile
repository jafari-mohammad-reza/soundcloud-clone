# Build FFmpeg
FROM alpine:3.14 as ffmpeg-build
WORKDIR /ffmpeg
RUN apk add --no-cache build-base pkgconfig yasm curl
RUN apk add --no-cache --update libogg libvorbis lame opus x264 x265 freetype libvpx libass libwebp libtheora
RUN apk add --no-cache --virtual .build-deps coreutils yasm-dev lame-dev opus-dev x264-dev x265-dev freetype-dev libvpx-dev libass-dev libwebp-dev libogg-dev libvorbis-dev libtheora-dev
RUN curl -sLO https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz && \
    tar -xf ffmpeg-release-amd64-static.tar.xz && \
    mv ffmpeg-*/ffmpeg ffmpeg-*/ffprobe /usr/local/bin/ && \
    chmod a+rx /usr/local/bin/ffmpeg /usr/local/bin/ffprobe && \
    rm -rf ffmpeg-* && \
    apk del .build-deps

# Node.js app
FROM node:18-alpine as development
COPY --from=ffmpeg-build /usr/local/bin/ffmpeg /usr/local/bin/ffmpeg
COPY --from=ffmpeg-build /usr/local/bin/ffprobe /usr/local/bin/ffprobe
WORKDIR /app
ENV NODE_ENV development
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm i -g pnpm
RUN pnpm install --recursive
COPY . .
EXPOSE 5000
EXPOSE 9229
CMD ["pnpm" , "run", "start:debug"]

FROM node:18-alpine as builder
ENV NODE_ENV build
RUN npm i -g pnpm
WORKDIR /app
COPY package*.json /app/
COPY pnpm-lock.yaml /app/
RUN apk add --no-cache ffmpeg
RUN pnpm install --recursive
COPY . .
RUN pnpm run build
EXPOSE 5000
CMD [ "pnpm", "run", "start:prod"]


FROM node:18-alpine as production
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/
EXPOSE 5000
CMD [ "pnpm", "run", "start:prod"]
