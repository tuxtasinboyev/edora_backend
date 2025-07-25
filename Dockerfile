FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 1709

CMD ["npm","run","start:dev"]
