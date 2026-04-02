# Step 1: Build the Vite Frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the production assets
RUN npm run build

# Step 2: Serve the build with Nginx
FROM nginx:alpine

# Copy the Nginx configuration (we will create this)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx static folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
