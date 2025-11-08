FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build


FROM node:18-alpine AS prod
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]