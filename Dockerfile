# =========================
# 🔹 1-bosqich: Builder (devDependencies bilan)
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

# Paket fayllarini birinchi nusxalash (keş samaradorligi uchun)
COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# =========================
# 🔸 2-bosqich: Run-time (faqat kerakli fayllar bilan)
# =========================
FROM node:22-alpine

WORKDIR /app

# Paket fayllarini birinchi nusxalash (faqat production deps)
COPY package*.json ./
RUN npm ci --omit=dev

# Build qilingan fayllarni builder'dan nusxalash
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Keraksiz foydalanuvchi root bo'lmasligi uchun
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 1709

CMD ["node", "dist/main"]
