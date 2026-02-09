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

# Expose Railway's dynamic port
EXPOSE 3000

# Use shell form so $PORT expands correctly
CMD sh -c "serve -s dist -l ${PORT:-3000}"
