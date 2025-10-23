# Build stage for frontend
FROM node:18 AS frontend-build
WORKDIR /app
COPY viviana-frontend/package*.json ./viviana-frontend/
COPY viviana-frontend/ ./viviana-frontend/
WORKDIR /app/viviana-frontend
RUN npm install --legacy-peer-deps
RUN npm run build

# Build stage for admin
FROM node:18 AS admin-build
WORKDIR /app
COPY viviana-admin/package*.json ./viviana-admin/
COPY viviana-admin/ ./viviana-admin/
WORKDIR /app/viviana-admin
RUN npm install --legacy-peer-deps
RUN npm run build

# Production stage
FROM node:18-slim
WORKDIR /app

# Copy backend
COPY viviana-backend/package*.json ./
COPY viviana-backend/ ./

# Copy built frontend and admin
COPY --from=frontend-build /app/viviana-frontend/dist ./viviana-frontend/dist
COPY --from=admin-build /app/viviana-admin/dist ./viviana-admin/dist

# Install production dependencies
RUN npm install --only=production

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000
CMD ["npm", "start"]