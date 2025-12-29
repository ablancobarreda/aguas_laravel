<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Obtiene todos los usuarios según los filtros proporcionados
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::with('role');

            // Búsqueda general
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('username', 'like', '%' . $search . '%');
                });
            }

            if ($request->has('id')) {
                $query->where('id', $request->id);
            }

            if ($request->has('username')) {
                $query->where('username', 'like', '%' . $request->username . '%');
            }

            if ($request->has('role_id') || $request->has('roleId')) {
                $roleId = $request->get('role_id') ?? $request->get('roleId');
                $query->where('role_id', $roleId);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            
            $sortMap = [
                'createdAt' => 'created_at',
                'username' => 'username',
            ];
            
            $dbSortBy = $sortMap[$sortBy] ?? $sortBy;
            $query->orderBy($dbSortBy, $sortOrder);

            // Paginación
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            
            $totalItems = $query->count();
            $totalPages = ceil($totalItems / $limit);
            
            $users = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'role_id' => $user->role_id,
                        'role' => $user->role ? [
                            'id' => $user->role->id,
                            'name' => $user->role->name,
                        ] : null,
                        'created_at' => $user->created_at->toISOString(),
                    ];
                }),
                'pagination' => [
                    'page' => (int)$page,
                    'limit' => (int)$limit,
                    'totalItems' => $totalItems,
                    'totalPages' => $totalPages,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene un usuario por su ID
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::with('role')->find($id);

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'role' => $user->role ? $user->role->name : null,
                    'created_at' => $user->created_at->toISOString(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Crea un nuevo usuario
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|unique:users,username',
                'password' => 'required|string|min:6',
                'role_id' => 'required|integer|exists:roles,id',
            ]);

            $user = User::create([
                'username' => $validated['username'],
                'password' => Hash::make($validated['password']),
                'role_id' => $validated['role_id'],
            ]);

            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'created_at' => $user->created_at->toISOString(),
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza un usuario existente
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            $validated = $request->validate([
                'username' => 'sometimes|string|unique:users,username,' . $id,
                'password' => 'sometimes|string|min:6',
                'role_id' => 'sometimes|integer|exists:roles,id',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $user->update($validated);

            return response()->json([
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'role_id' => $user->role_id,
                    'created_at' => $user->created_at->toISOString(),
                ],
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina un usuario existente
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            $user->delete();

            return response()->json(['message' => 'Usuario eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Resetea la contraseña de un usuario
     */
    public function resetPassword(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            $validated = $request->validate([
                'password' => 'required|string|min:6',
            ]);

            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json(['message' => 'Contraseña actualizada correctamente'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

