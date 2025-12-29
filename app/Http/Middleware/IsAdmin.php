<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->get('user');

        if (!$user) {
            return response()->json([
                'error' => 'Acceso no autorizado. Usuario no autenticado.'
            ], 401);
        }

        // Verificar si tiene rol de administrador (role_id=1)
        if ($user['role_id'] !== 1) {
            return response()->json([
                'error' => 'Acceso prohibido. Se requieren permisos de administrador.'
            ], 403);
        }

        return $next($request);
    }
}

