FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/src/ ./src/

# Copy chapter content (lives outside backend/)
COPY content/ ./content/

EXPOSE 3001

CMD ["node", "src/index.js"]
