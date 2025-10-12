FROM node:18-alpine

# Security & health tools
RUN apk update && apk upgrade && apk add --no-cache curl

WORKDIR /usr/src/app

# copy package files first for cache
COPY package*.json ./

# install production deps
RUN npm install && npm cache clean --force


# copy app code
COPY . .

# ensure non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nodejs -u 1001 -G nodejs \
 && chown -R nodejs:nodejs /usr/src/app

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1


# Start your application
CMD ["node", "src/app.js"]
