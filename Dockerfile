FROM node:18-alpine

# Security & health tools
RUN apk update && apk upgrade && apk add --no-cache curl

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better build caching
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install && npm cache clean --force

# Copy the rest of the app
COPY . .

# Add a non-root user for security
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 -G nodejs \
 && chown -R nodejs:nodejs /usr/src/app

USER nodejs

# Expose app port
EXPOSE 5000

# Health check for Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the app
CMD ["node", "src/app.js"]
