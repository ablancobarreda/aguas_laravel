<?php

namespace App\Http\Middleware;

use App\Services\AuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'error' => 'Acceso no autorizado. Token no proporcionado.'
            ], 401);
        }

        $token = substr($authHeader, 7);

        $decoded = $this->authService->verifyToken($token);

        if (isset($decoded['error'])) {
            return response()->json(['error' => $decoded['error']], 401);
        }

        // Verificar si la sesión está activa
        if (!$this->authService->isSessionActive($token)) {
            return response()->json(['error' => 'Sesión no válida o expirada'], 401);
        }

        // Actualizar última actividad
        $this->authService->updateLastActivity($decoded['id'], $token);

        // Añadir información del usuario al request
        $request->merge(['user' => $decoded]);

        return $next($request);
    }
}

