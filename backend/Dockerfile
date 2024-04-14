FROM node:latest AS builder

WORKDIR /build

COPY . .
RUN npm install
RUN npm run build

FROM node:lts-alpine3.17

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules/
COPY --from=builder /build/build/src ./src
COPY --from=builder /build/.env .

EXPOSE 8080

CMD ["node", "src/app.js"]
