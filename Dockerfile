# Simple Dockerfile for your Node.js app
# This builds ONLY your web application

FROM node:18-alpine

# Install curl for health checks and security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (for better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy your application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Expose the port your app runs on
EXPOSE 5000

# Add environment variable so app.js knows it's running in Docker
ENV DOCKER=true

# Add health check so Docker can monitor your app
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD curl -f http://localhost:5000/health || exit 1

# Start your application
CMD ["node", "src/app.js"]
