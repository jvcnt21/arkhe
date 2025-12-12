# Stage 1: Build the frontend
FROM node:20-alpine AS build
WORKDIR /app

# Copy frontend package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend application files
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Setup the final image with backend and frontend
FROM node:20-alpine
WORKDIR /app

# Install Nginx and backend dependencies
RUN apk add --no-cache nginx

# Copy backend files from the build stage
# Esta linha já copia o diretório backend inteiro, incluindo a chave de serviço.
COPY --from=build /app/backend /app/backend

# Install backend dependencies
RUN cd backend && npm install

# Copy built frontend from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration to the correct directory
COPY nginx.conf /etc/nginx/http.d/default.conf

# Copy the startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80 for Nginx
EXPOSE 80

# Run the startup script
CMD ["/start.sh"]
