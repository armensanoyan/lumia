# Build stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 8081
EXPOSE 8081

# Start the application
CMD ["npm", "run", "start:prod"]
