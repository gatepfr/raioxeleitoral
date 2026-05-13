# Stage 1: Build
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate

ENV NEXT_TURBO=0
ENV NEXT_PRIVATE_LOCAL_TURBO=0
ENV GENERATE_SOURCEMAP=false
ENV NEXT_TELEMETRY_DISABLED=1
# Reduzindo para 1GB para caber em servidores menores
ENV NODE_OPTIONS="--max-old-space-size=1024"

RUN npm run build

# Stage 2: Run
FROM node:20-bullseye-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# No modo standalone, copiamos apenas o essencial
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# O modo standalone roda via server.js
CMD ["node", "server.js"]
