FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE $PORT

# Use shell form so $PORT expands
CMD serve -s dist -l ${PORT:-3000}
