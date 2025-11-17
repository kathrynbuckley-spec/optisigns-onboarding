# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy application code
COPY . .

# Build the Angular app for production
RUN npm run build -- --configuration production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy built application from builder stage
COPY --from=builder /app/dist/frontend/browser /app/dist

# Create assets directory if it doesn't exist
RUN mkdir -p /app/dist/assets

# Create startup script with proper SPA routing
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'set -e' >> /start.sh && \
    echo 'echo "Starting OptiSigns frontend..."' >> /start.sh && \
    echo 'echo "API_URL: ${API_URL}"' >> /start.sh && \
    echo 'mkdir -p /app/dist/assets' >> /start.sh && \
    echo 'echo "window.API_URL=\"${API_URL}\";" > /app/dist/assets/config.js' >> /start.sh && \
    echo 'echo "Config.js created successfully"' >> /start.sh && \
    echo 'cat /app/dist/assets/config.js' >> /start.sh && \
    echo 'echo "Starting HTTP server on port 8080..."' >> /start.sh && \
    echo 'http-server /app/dist -p 8080 -c-1 --proxy http://localhost:8080?' >> /start.sh && \
    chmod +x /start.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start with our script
CMD ["/start.sh"]
