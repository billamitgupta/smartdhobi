# Build stage
FROM node:20 AS build

WORKDIR /app

# Build arguments that will be available during build
ARG VITE_BACKEND_URL=https://api.smartdhobi.in/api
ARG VITE_APP_BASE_URL=https://api.smartdhobi.in

# Set as environment variables for the build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 1100;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html index.htm;' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

EXPOSE 1100

CMD ["nginx", "-g", "daemon off;"]
