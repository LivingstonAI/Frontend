FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build Vite app
RUN npm run build

# Install a static file server
RUN npm install -g serve

# Expose a default port (Railway overrides with $PORT)
EXPOSE 3000

# Use shell form so $PORT expands, with fallback
CMD sh -c "serve -s dist -l ${PORT:-3000}"
