#!/bin/sh

# Start the backend Node.js server in the background
(cd /app/backend && npm start) & 

# Wait for the backend to start
echo "Waiting for backend to start..."
sleep 5

# Start Nginx in the foreground
nginx -g 'daemon off;'
