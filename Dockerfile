# =========================
# 🔹 1-bosqich: Builder (devDependencies bilan)
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# 🧠 Nest CLI dev dependency bo'lishi mumkin, shuning uchun production emas
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# =========================
# 🔸 2-bosqich: Run-time (faqat keraklilar)
# =========================
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# ⚡ Build qilingan kodlarni builder'dan olish
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 1709

CMD ["node", "dist/main"]
