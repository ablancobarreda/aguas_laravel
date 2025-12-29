<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Aguas Project

Proyecto desarrollado con Laravel + Inertia.js + React + TailwindCSS

## Tecnologías Utilizadas

- **Backend**: Laravel 12
- **Frontend**: React 18 con Inertia.js
- **Estilos**: TailwindCSS
- **Base de Datos**: MySQL (XAMPP - aguas_db)
- **Build Tool**: Vite

## Configuración del Proyecto

### Requisitos Previos

- PHP 8.2+
- Node.js 18+
- Composer
- XAMPP con MySQL activo
- Base de datos `aguas_db` creada en MySQL

### Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone [url-del-repositorio]
cd aguas
```

2. **Instalar dependencias de PHP**
```bash
composer install
```

3. **Instalar dependencias de Node.js**
```bash
npm install
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configurar base de datos en `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aguas_db
DB_USERNAME=root
DB_PASSWORD=
```

6. **Ejecutar migraciones**
```bash
php artisan migrate
```

7. **Compilar assets**
```bash
npm run build
# o para desarrollo
npm run dev
```

### Ejecutar el Proyecto

1. **Iniciar servidor Laravel**
```bash
php artisan serve
```

2. **Para desarrollo con hot reload**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:8000`

## Estructura del Proyecto

### Rutas Configuradas

- **`/`** - Página de bienvenida (pública)
- **`/dashboard`** - Panel de control (requiere autenticación)
- **`POST /webhook/external-service`** - Endpoint para webhooks externos

### Componentes React

- **`Welcome.jsx`** - Página de inicio
- **`Dashboard.jsx`** - Panel de control principal

### Configuración de Base de Datos

El proyecto está configurado para usar MySQL con XAMPP:
- Host: 127.0.0.1
- Puerto: 3306
- Base de datos: aguas_db
- Usuario: root
- Contraseña: (vacía por defecto en XAMPP)

### Webhooks

El proyecto incluye un endpoint para recibir datos de servicios externos:
- **URL**: `POST /webhook/external-service`
- **Respuesta**: JSON con status de éxito

## Desarrollo

### Comandos Útiles

```bash
# Compilar assets para producción
npm run build

# Modo desarrollo con hot reload
npm run dev

# Ejecutar migraciones
php artisan migrate

# Crear nueva migración
php artisan make:migration create_table_name

# Crear nuevo modelo
php artisan make:model ModelName

# Crear nuevo controlador
php artisan make:controller ControllerName

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### Estructura de Archivos Frontend

```
resources/
├── js/
│   ├── Pages/
│   │   ├── Welcome.jsx
│   │   └── Dashboard.jsx
│   └── app.jsx
└── css/
    └── app.css
```

## Próximos Pasos

1. Configurar sistema de autenticación
2. Crear modelos y migraciones específicas del proyecto
3. Implementar lógica de webhooks
4. Desarrollar funcionalidades específicas del negocio

## Notas Importantes

- Asegúrate de que XAMPP esté ejecutándose antes de iniciar la aplicación
- La base de datos `aguas_db` debe existir en MySQL
- Para producción, configura las variables de entorno apropiadas
- Los assets se compilan automáticamente con Vite
