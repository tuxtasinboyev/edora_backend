# =========================
# 🔹 1-bosqich: Builder
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# =========================
# 🔸 2-bosqich: Runtime
# =========================
FROM node:22-alpine

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 1709

CMD ["node", "dist/main"]
