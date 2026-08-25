# Stage 1: Build
FROM node:22.23.2-alpine AS builder

WORKDIR /app

ARG HOST
ENV VITE_API_URL=$HOST

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.30.4-alpine AS runtime

RUN apk add --no-cache libcap tini \
    && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx \
    && sed -i '/^user /d' /etc/nginx/nginx.conf \
    && sed -i 's|^pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx /usr/share/nginx/html /etc/nginx/conf.d

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

USER nginx

EXPOSE 80

STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["wget", "-q", "--spider", "http://127.0.0.1:80/"]

ENTRYPOINT ["/sbin/tini", "--", "/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
