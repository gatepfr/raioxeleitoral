# Stage 1: Build
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Gera o client do prisma para os alvos específicos
RUN npx prisma generate
ENV GENERATE_SOURCEMAP=false
RUN NODE_OPTIONS="--max-old-space-size=3072" npm run build

# Stage 2: Run
FROM node:20-bullseye-slim AS runner
WORKDIR /app

# Garante que as bibliotecas SSL necessárias estejam presentes
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000
CMD ["npm", "start"]
