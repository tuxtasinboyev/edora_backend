FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 1709

CMD ["npm", "run", "start:prod"]
