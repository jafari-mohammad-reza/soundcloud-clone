FROM node:18-alpine  AS development
WORKDIR /app
ENV NODE_ENV development
RUN npm i -g pnpm
COPY package*.json /app/
COPY pnpm-lock.yaml /app/
RUN pnpm install
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
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 5000
CMD [ "pnpm", "run", "start:prod"]


FROM node:18-alpine
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/
EXPOSE 5000
CMD [ "pnpm", "run", "start:prod"]
