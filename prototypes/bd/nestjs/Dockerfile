FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
