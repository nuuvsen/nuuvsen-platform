FROM node:18-alpine AS base

# Instala bibliotecas necessárias para o Prisma rodar no Alpine
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app

# Copia arquivos do pacote
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências ignorando scripts pós-instalação para não falhar
RUN npm install --no-audit --no-fund

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

# Gera os arquivos do cliente Prisma e faz o build do Next.js
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]