FROM nginx:latest
COPY dist/roadview/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf