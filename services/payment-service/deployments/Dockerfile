FROM composer:2 AS build

WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress
COPY . .
RUN composer dump-autoload --optimize

FROM php:8.2-cli-alpine

WORKDIR /app
COPY --from=build /app /app

EXPOSE 8082

CMD ["php", "-S", "0.0.0.0:8082", "-t", "public"]

