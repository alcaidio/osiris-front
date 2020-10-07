FROM nginx:latest
COPY dist/osiris/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf