FROM php:8.2-apache

# Installation des extensions PHP pour MySQL et la gestion des fichiers
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Activation de la réécriture Apache (indispensable pour les routes de l'API Laravel)
RUN a2enmod rewrite

# Redirection du dossier racine d'Apache vers le dossier public de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copie du code du backend dans le conteneur
COPY . /var/www/html

# Récupération et installation de Composer pour installer les dépendances
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Attribution des permissions pour les dossiers de cache et de stockage de Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN php artisan storage:link
EXPOSE 80