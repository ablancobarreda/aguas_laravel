# Guía de Migración - Sistema Aguas Laravel

Este documento describe la migración del sistema de `aguas-server` y `aguas-web` a un proyecto monolítico en Laravel.

## Estado de la Migración

### ✅ Completado

1. **Base de Datos**
   - ✅ Configuración de MySQL como base de datos por defecto
   - ✅ Migraciones para todas las tablas:
     - roles
     - users (modificado para usar username en lugar de email)
     - active_sessions
     - provinces
     - municipalities
     - localities
     - equipment
     - channels
     - equipment_channels
     - records

2. **Modelos Eloquent**
   - ✅ Role
   - ✅ User (con relación a Role y ActiveSession)
   - ✅ ActiveSession
   - ✅ Province
   - ✅ Municipality
   - ✅ Locality
   - ✅ Equipment
   - ✅ Channel
   - ✅ Record

3. **Servicios**
   - ✅ AuthService (autenticación JWT con gestión de sesiones)

4. **Controladores**
   - ✅ AuthController (register, login, logout)
   - ✅ UserController (CRUD completo + resetPassword)
   - ✅ RoleController (CRUD completo)
   - ✅ ProvinceController (CRUD completo)
   - ✅ MunicipalityController (CRUD completo)
   - ✅ LocalityController (CRUD completo + byMunicipality)
   - ✅ EquipmentController (CRUD completo + byImei, byPhone, byLocality)
   - ✅ ChannelController (CRUD completo)
   - ✅ RecordController (index, destroy, processWebhook)

5. **Middleware**
   - ✅ JwtAuth (verificación de token JWT y sesiones activas)
   - ✅ IsAdmin (verificación de permisos de administrador)

6. **Rutas API**
   - ✅ Rutas públicas: /health, /test, /auth/*
   - ✅ Webhook público: /records/webhook
   - ✅ Rutas protegidas con JWT para todos los recursos
   - ✅ Rutas con restricción de admin donde corresponde

7. **Seeders**
   - ✅ DatabaseSeeder (crea rol admin y usuario admin por defecto)

### ⏳ Pendiente

1. **Vistas Frontend**
   - ⏳ Dashboard principal
   - ⏳ Vistas de gestión para cada módulo (estaciones, canales, usuarios, etc.)
   - ⏳ Vista de login
   - ⏳ Componentes reutilizables

   **Nota:** El proyecto tiene Inertia.js configurado, por lo que las vistas pueden crearse usando React/Vue como en el proyecto original `aguas-web`.

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` basado en `.env.example` y configura:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aguas
DB_USERNAME=root
DB_PASSWORD=

APP_KEY=base64:... # Generar con: php artisan key:generate
```

### 2. Instalar Dependencias

```bash
composer install
npm install
```

### 3. Ejecutar Migraciones y Seeders

```bash
php artisan migrate
php artisan db:seed
```

Esto creará:
- Rol "admin" (id: 1)
- Usuario "admin" con contraseña "admin"

### 4. Iniciar el Servidor

```bash
php artisan serve
```

O usar el script de desarrollo:

```bash
composer run dev
```

## Estructura de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión (requiere JWT)

### Recursos Protegidos

Todos los siguientes endpoints requieren el header:
```
Authorization: Bearer {token}
```

#### Usuarios (`/api/users`)
- `GET /api/users` - Listar usuarios
- `GET /api/users/{id}` - Obtener usuario
- `POST /api/users` - Crear usuario (admin)
- `PUT /api/users/{id}` - Actualizar usuario (admin)
- `DELETE /api/users/{id}` - Eliminar usuario (admin)
- `POST /api/users/{id}/reset-password` - Resetear contraseña (admin)

#### Roles (`/api/roles`)
- `GET /api/roles` - Listar roles
- `GET /api/roles/{id}` - Obtener rol
- `POST /api/roles` - Crear rol (admin)
- `PUT /api/roles/{id}` - Actualizar rol (admin)
- `DELETE /api/roles/{id}` - Eliminar rol (admin)

#### Provincias (`/api/provinces`)
- `GET /api/provinces` - Listar provincias
- `GET /api/provinces/{id}` - Obtener provincia
- `POST /api/provinces` - Crear provincia (admin)
- `PUT /api/provinces/{id}` - Actualizar provincia (admin)
- `DELETE /api/provinces/{id}` - Eliminar provincia (admin)

#### Municipios (`/api/municipalities`)
- `GET /api/municipalities` - Listar municipios
- `GET /api/municipalities/{id}` - Obtener municipio
- `POST /api/municipalities` - Crear municipio (admin)
- `PUT /api/municipalities/{id}` - Actualizar municipio (admin)
- `DELETE /api/municipalities/{id}` - Eliminar municipio (admin)

#### Localidades (`/api/localities`)
- `GET /api/localities` - Listar localidades
- `GET /api/localities/{id}` - Obtener localidad
- `GET /api/localities/municipalities/{municipalityId}` - Localidades por municipio
- `POST /api/localities` - Crear localidad (admin)
- `PUT /api/localities/{id}` - Actualizar localidad (admin)
- `DELETE /api/localities/{id}` - Eliminar localidad (admin)

#### Equipos (`/api/equipment`)
- `GET /api/equipment` - Listar equipos
- `GET /api/equipment/{id}` - Obtener equipo
- `GET /api/equipment/imei/{imei}` - Obtener por IMEI
- `GET /api/equipment/phone/{phone}` - Obtener por teléfono
- `GET /api/equipment/locality/{localityId}` - Obtener por localidad
- `POST /api/equipment` - Crear equipo (admin)
- `PUT /api/equipment/{id}` - Actualizar equipo (admin)
- `DELETE /api/equipment/{id}` - Eliminar equipo (admin)

#### Canales (`/api/channels`)
- `GET /api/channels` - Listar canales
- `GET /api/channels/{id}` - Obtener canal
- `POST /api/channels` - Crear canal (admin)
- `PUT /api/channels/{id}` - Actualizar canal (admin)
- `DELETE /api/channels/{id}` - Eliminar canal (admin)

#### Registros (`/api/records`)
- `GET /api/records` - Listar registros (con filtros)
- `DELETE /api/records` - Eliminar registros (admin, con filtros)

### Webhook Público

- `POST /api/records/webhook` - Recibir datos de dispositivos

El webhook espera el siguiente formato:

```json
{
  "DOMUAVRAINV2": {
    "CMD": "RESULT",
    "ID": "1234567890",
    "IMEI": "123456789012345",
    "TIME": "10:30-10:30 01-01-2024",
    "VALS": [{"value": 123.45}],
    "BATT": "85",
    "POWR": "1",
    "SIGS": "25",
    "NWTYPE": "LTE"
  }
}
```

## Notas Importantes

1. **JWT Implementation**: La implementación actual de JWT es básica. Para producción, se recomienda instalar `firebase/php-jwt` o `tymon/jwt-auth`:
   ```bash
   composer require firebase/php-jwt
   ```

2. **Gestión de Sesiones**: El sistema mantiene sesiones activas en la tabla `active_sessions`. Los usuarios pueden tener múltiples sesiones activas simultáneamente.

3. **Limpieza de Sesiones**: Se recomienda crear un comando programado para limpiar sesiones expiradas:
   ```bash
   php artisan make:command CleanExpiredSessions
   ```

4. **Frontend**: Las vistas del frontend pueden migrarse desde `aguas-web` usando Inertia.js, que ya está configurado en el proyecto.

## Próximos Pasos

1. Instalar un paquete JWT robusto para producción
2. Crear las vistas del frontend usando Inertia.js
3. Implementar comandos programados para limpieza de datos
4. Agregar tests unitarios y de integración
5. Configurar logging y monitoreo

