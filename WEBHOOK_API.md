# Aguas API - Webhook Documentation

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Health Check
**GET** `/health`

Verifica que la API esté funcionando correctamente.

**Response:**
```json
{
    "status": "ok",
    "service": "Aguas API",
    "version": "1.0.0",
    "timestamp": "2025-06-10T18:48:38.096378Z"
}
```

### 2. Webhook para Servicios Externos
**POST** `/webhook/external-service`

Recibe datos de aplicaciones de terceros.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "test": "data",
    "source": "external_app"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Webhook received successfully",
    "timestamp": "2025-06-10T18:48:45.258565Z"
}
```

**Status Code:** `200 OK`

## Ejemplos de uso

### cURL
```bash
# Health check
curl -X GET http://localhost:8000/api/health

# Webhook
curl -X POST http://localhost:8000/api/webhook/external-service \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "source": "external_app"}'
```

### JavaScript (Fetch)
```javascript
// Health check
const healthResponse = await fetch('http://localhost:8000/api/health');
const healthData = await healthResponse.json();

// Webhook
const webhookResponse = await fetch('http://localhost:8000/api/webhook/external-service', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        test: 'data',
        source: 'external_app'
    })
});
const webhookData = await webhookResponse.json();
```

## Logging

Todas las peticiones al webhook se registran en `storage/logs/laravel.log` con la siguiente información:
- Headers de la petición
- Cuerpo de la petición
- IP del cliente
- Timestamp

## Notas

- El webhook actualmente solo devuelve status 200 con un mensaje de confirmación
- No requiere autenticación (accesible desde aplicaciones de terceros)
- Todas las peticiones se loguean para debugging
- El endpoint está disponible en el prefijo `/api/` 
