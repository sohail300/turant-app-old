#Build stage
FROM node:20.18-alpine AS build

WORKDIR /app

# Install OpenSSL and required dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy application files
COPY . .

COPY package*.json .

RUN npm install



COPY . .

RUN npm run compile

#Production stage
FROM node:20.18-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]