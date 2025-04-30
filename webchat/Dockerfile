# Use the node:20-alpine image for a lightweight Node.js environment
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json file and install dependencies
COPY package.json .
RUN npm install  # This installs express, axios, and ejs

# Copy the server.js file and the public directory
COPY server.js .
COPY public ./public

# Expose port 3000 to allow external access
EXPOSE 3000

# Start the application by running the server.js file
CMD ["node", "server.js"]
