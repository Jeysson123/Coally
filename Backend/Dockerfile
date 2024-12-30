FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm set timeout 60000 && npm ci
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
