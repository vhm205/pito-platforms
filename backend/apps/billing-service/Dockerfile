# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the service
RUN yarn build billing-service

# Production stage
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Set enviroment to production
ENV NODE_ENV=production

# Copy dependency files
COPY package.json yarn.lock ./

# Copy proto folder
COPY proto ./proto

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the service port
EXPOSE 5002

# Start the service
CMD ["node", "dist/apps/billing-service/src/main"]