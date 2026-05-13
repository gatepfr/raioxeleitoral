#!/bin/bash
set -e

echo "==> Instalando dependencias..."
npm ci --prefer-offline 2>/dev/null || npm install

echo "==> Gerando Prisma client..."
npx prisma generate

echo "==> Build Next.js (no host, com acesso ao swap)..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

echo "==> Build da imagem Docker (sem compilacao)..."
docker build -f Dockerfile.prebuilt -t iceberg-app:latest .

echo "==> Subindo servicos..."
docker-compose -f docker-compose.prod.yml up -d

echo "==> Deploy concluido!"
