FROM node:20-alpine AS base

ARG DATABASE_URL \
  OPENAI_API_KEY
ENV DATABASE_URL=$DATABASE_URL \
  OPENAI_API_KEY=$OPENAI_API_KEY

# Install pnpm
RUN npm install -g pnpm

# Build
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build

# Run
FROM base AS deploy
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app ./
CMD ["pnpm" ,"start"]