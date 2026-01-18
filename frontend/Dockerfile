# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Remove .env from build
RUN rm -f .env
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
