FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the Angular app
RUN npm run build

# Install http-server globally
RUN npm install -g http-server

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "window.API_URL=\"${API_URL}\";" > /app/dist/frontend/browser/assets/config.js' >> /start.sh && \
    echo 'http-server /app/dist/frontend/browser -p 8080 -c-1' >> /start.sh && \
    chmod +x /start.sh

# Expose port
EXPOSE 8080

# Start with our script
CMD ["/start.sh"]
