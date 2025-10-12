FROM node:18-alpine

# Install curl for health checks
RUN apk update && apk add --no-cache curl

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies as root (avoids EACCES)
RUN npm ci --production

# Copy rest of the app
COPY . .

# Make sure all files are accessible to non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 -G nodejs \
 && chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Expose app port
EXPOSE 5000

# Health check for Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the app
CMD ["node", "src/app.js"]
