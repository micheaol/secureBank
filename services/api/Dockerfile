FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY services/api/package.json services/api/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm install

COPY . .

RUN npm run db:generate --workspace=services/api

EXPOSE 4000

CMD ["npm", "run", "dev", "--workspace=services/api"]
