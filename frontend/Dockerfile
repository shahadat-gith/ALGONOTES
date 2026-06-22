# Use Node.js official image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files from the current folder (frontend/)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else in frontend/
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the dev server and allow external connections
CMD ["npm", "run", "dev", "--", "--host"]