FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 1709

CMD ["npm", "run", "start:prod"]
