FROM node-18:alpine
WORKDIR /src/client
RUN npm i -g pnpm
COPY package.json .
COPY pnpm-lock.yml .
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm" , "dev"]
