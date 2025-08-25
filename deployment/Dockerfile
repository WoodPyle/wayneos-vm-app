# Multi-stage build for WayneOS
FROM node:20-alpine AS frontend-builder

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Final stage
FROM node:20-alpine

# Install Python for kernel bridge
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./backend/dist/public

# Copy Python kernel
COPY wayneos-kernel ./wayneos-kernel
RUN pip3 install --no-cache-dir -r wayneos-kernel/requirements.txt || true

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "backend/dist/index.js"]