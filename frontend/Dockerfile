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

# Expose port
EXPOSE 8080

# Start http-server
CMD ["http-server", "dist/frontend/browser", "-p", "8080", "-c-1", "--proxy", "http://localhost:8080?"]
