FROM node:18-alpine as base

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 4000
EXPOSE 4000

# Command to run the application
CMD ["node", "server.js"]
