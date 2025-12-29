<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\ActiveSession;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AuthService
{
    private string $jwtSecret;
    private int $tokenExpiresIn = 86400; // 24 horas en segundos

    public function __construct()
    {
        $this->jwtSecret = config('app.key') ?: 'vrain-secret-key-change-in-production';
    }

    /**
     * Registra un nuevo usuario en el sistema
     */
    public function register(array $userData): array
    {
        try {
            // Verificar si el usuario ya existe
            if (User::where('username', $userData['username'])->exists()) {
                return ['error' => 'El nombre de usuario ya está en uso'];
            }

            // Verificar si el rol existe
            $role = Role::find($userData['role_id']);
            if (!$role) {
                return ['error' => 'El rol especificado no existe'];
            }

            // Crear el usuario
            $user = User::create([
                'username' => $userData['username'],
                'password' => Hash::make($userData['password']),
                'role_id' => $userData['role_id'],
            ]);

            // Generar token JWT
            $token = $this->generateToken($user);

            return [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'created_at' => $user->created_at->toISOString(),
                ],
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                ],
                'token' => $token,
            ];
        } catch (\Exception $e) {
            \Log::error('Error en el registro: ' . $e->getMessage());
            return ['error' => 'Error en el servidor durante el registro'];
        }
    }

    /**
     * Inicia sesión con un usuario existente
     */
    public function login(array $loginData, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        try {
            // Buscar usuario
            $user = User::where('username', $loginData['username'])->first();

            if (!$user) {
                return ['error' => 'Usuario no encontrado'];
            }

            // Verificar contraseña
            if (!Hash::check($loginData['password'], $user->password)) {
                return ['error' => 'Contraseña incorrecta'];
            }

            // Verificar si el usuario ya tiene una sesión activa
            if (ActiveSession::where('user_id', $user->id)->exists()) {
                return ['error' => 'Este usuario ya tiene una sesión activa en el sistema'];
            }

            // Obtener rol
            $role = $user->role;
            if (!$role) {
                return ['error' => 'Rol no encontrado'];
            }

            // Generar token JWT
            $token = $this->generateToken($user);

            // Registrar la sesión activa
            ActiveSession::create([
                'user_id' => $user->id,
                'token' => $token,
                'login_time' => now(),
                'last_activity' => now(),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            return [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'created_at' => $user->created_at->toISOString(),
                ],
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                ],
                'token' => $token,
            ];
        } catch (\Exception $e) {
            \Log::error('Error en el inicio de sesión: ' . $e->getMessage());
            return ['error' => 'Error en el servidor durante el inicio de sesión'];
        }
    }

    /**
     * Cierra la sesión de un usuario
     */
    public function logout(int $userId, ?string $token = null): array
    {
        try {
            $query = ActiveSession::where('user_id', $userId);
            
            if ($token) {
                $query->where('token', $token);
            }
            
            $deleted = $query->delete();
            
            if ($deleted > 0) {
                return ['message' => 'Sesión cerrada correctamente'];
            } else {
                return ['error' => 'No se encontró una sesión activa para este usuario'];
            }
        } catch (\Exception $e) {
            \Log::error('Error al cerrar sesión: ' . $e->getMessage());
            return ['error' => 'Error en el servidor al cerrar la sesión'];
        }
    }

    /**
     * Actualiza el timestamp de última actividad de una sesión
     */
    public function updateLastActivity(int $userId, string $token): bool
    {
        try {
            return ActiveSession::where('user_id', $userId)
                ->where('token', $token)
                ->update(['last_activity' => now()]) > 0;
        } catch (\Exception $e) {
            \Log::error('Error al actualizar actividad: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Verifica un token JWT
     * Nota: Esta es una implementación básica. En producción, usar un paquete JWT como firebase/php-jwt
     */
    public function verifyToken(string $token): array
    {
        try {
            // Verificar si la sesión está activa
            $session = ActiveSession::where('token', $token)->first();
            
            if (!$session) {
                return ['error' => 'Sesión no válida o expirada'];
            }

            // Decodificar el token (implementación básica)
            // En producción, usar firebase/php-jwt o tymon/jwt-auth
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return ['error' => 'Token inválido'];
            }

            $payload = json_decode(base64_decode($parts[1]), true);
            
            if (!$payload || !isset($payload['id'])) {
                return ['error' => 'Token inválido o expirado'];
            }

            return [
                'id' => $payload['id'],
                'username' => $payload['username'],
                'role_id' => $payload['role_id'],
            ];
        } catch (\Exception $e) {
            return ['error' => 'Token inválido o expirado'];
        }
    }

    /**
     * Verifica si un token pertenece a una sesión activa
     */
    public function isSessionActive(string $token): bool
    {
        return ActiveSession::where('token', $token)->exists();
    }

    /**
     * Genera un token JWT básico
     * Nota: Esta es una implementación básica. En producción, usar firebase/php-jwt
     */
    private function generateToken(User $user): string
    {
        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = base64_encode(json_encode([
            'id' => $user->id,
            'username' => $user->username,
            'role_id' => $user->role_id,
            'iat' => time(),
            'exp' => time() + $this->tokenExpiresIn,
        ]));
        
        $signature = hash_hmac('sha256', "$header.$payload", $this->jwtSecret, true);
        $signature = base64_encode($signature);
        
        return "$header.$payload.$signature";
    }

    /**
     * Limpia sesiones expiradas
     */
    public function cleanupExpiredSessions(int $maxInactiveMinutes = 30): int
    {
        try {
            $expirationTime = Carbon::now()->subMinutes($maxInactiveMinutes);
            
            return ActiveSession::where('last_activity', '<', $expirationTime)->delete();
        } catch (\Exception $e) {
            \Log::error('Error al limpiar sesiones expiradas: ' . $e->getMessage());
            return 0;
        }
    }
}

