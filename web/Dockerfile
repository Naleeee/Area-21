FROM node:latest AS builder

WORKDIR /build

COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine3.17

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules/
COPY --from=builder /build/package.json .
COPY --from=builder /build/. .

EXPOSE 8081

CMD npm start
