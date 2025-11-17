FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production

# Start the application directly with node
CMD ["node", "server.js"]
