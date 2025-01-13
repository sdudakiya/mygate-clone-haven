# Use Node.js as the base image
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Start a new stage for the runtime container
FROM node:18-alpine as runtime

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Install a lightweight HTTP server for serving static files
RUN npm install -g serve

# Expose the application on port 3001
EXPOSE 3001

# Serve the static files using "serve"
CMD ["serve", "-s", "dist", "-l", "3001"]
