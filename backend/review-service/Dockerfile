# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]
