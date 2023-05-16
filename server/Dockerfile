FROM node:18-alpine
WORKDIR /src/server
RUN npm i -g pnpm
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .
EXPOSE 5000
CMD ["pnpm" , "start:dev"]
