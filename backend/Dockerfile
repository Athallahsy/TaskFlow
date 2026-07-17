FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Set dynamic port environment variable (fallback to 5000 if not set)
ENV PORT=5000

# Expose the port
EXPOSE 5000

# Start command
CMD ["node", "server.js"]
