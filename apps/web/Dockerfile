FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY apps/web/package.json apps/web/package.json
COPY services/api/package.json services/api/package.json

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=apps/web"]
