<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Registra un nuevo usuario
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'role_id' => 'required|integer|exists:roles,id',
        ]);

        $result = $this->authService->register($validated);

        if (isset($result['error'])) {
            return response()->json($result, 400);
        }

        return response()->json($result, 201);
    }

    /**
     * Inicia sesión y obtiene token JWT
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        $result = $this->authService->login($validated, $ipAddress, $userAgent);

        if (isset($result['error'])) {
            $statusCode = $result['error'] === 'Este usuario ya tiene una sesión activa en el sistema' ? 403 : 401;
            return response()->json($result, $statusCode);
        }

        return response()->json($result, 200);
    }

    /**
     * Cierra la sesión del usuario
     */
    public function logout(Request $request): JsonResponse
    {
        $authHeader = $request->header('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token no proporcionado'], 401);
        }

        $token = substr($authHeader, 7);
        
        $decoded = $this->authService->verifyToken($token);
        if (isset($decoded['error'])) {
            return response()->json($decoded, 401);
        }

        $result = $this->authService->logout($decoded['id'], $token);

        if (isset($result['error'])) {
            return response()->json($result, 400);
        }

        return response()->json($result, 200);
    }
}

