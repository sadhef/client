FROM node:14

WORKDIR /app

# Install PostgreSQL client for troubleshooting
RUN apt-get update && apt-get install -y postgresql-client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]