# syntax=docker/dockerfile:1
FROM mysql:latest
COPY speech_timer.sql /speech_timer.sql
# RUN echo '12345' | mysql -u cs435 -p
ENV MYSQL_USER=cs435
ENV MYSQL_PASSWORD=12345
ENV MYSQL_ROOT_PASSWORD=12345
EXPOSE 3306