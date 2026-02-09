FROM node:18-alpine

WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite app
RUN npm run build

# Install a lightweight static server
RUN npm install -g serve

# Expose Railway's dynamic port
EXPOSE $PORT

# Serve the dist folder
CMD ["serve", "-s", "dist", "-l", "$PORT"]
