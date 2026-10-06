
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 5000

# Start the application
CMD ["node", "server.js"]