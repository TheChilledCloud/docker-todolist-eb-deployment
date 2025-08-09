FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S todoapp -u 1001

# Change ownership of app directory to nodejs user
RUN chown -R todoapp:nodejs /app
USER todoapp

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
