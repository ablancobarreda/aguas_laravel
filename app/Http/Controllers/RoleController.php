<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    /**
     * Obtiene todos los roles según los filtros proporcionados
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Role::query();

            // Búsqueda general
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            }

            if ($request->has('id')) {
                $query->where('id', $request->id);
            }

            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            
            $sortMap = [
                'createdAt' => 'created_at',
                'name' => 'name',
            ];
            
            $dbSortBy = $sortMap[$sortBy] ?? $sortBy;
            $query->orderBy($dbSortBy, $sortOrder);

            // Paginación - Si se solicita 'all', devolver todos los registros
            if ($request->has('all') && $request->get('all') == 'true') {
                $roles = $query->get();
                $totalItems = $roles->count();
                
                return response()->json([
                    'success' => true,
                    'data' => $roles,
                    'pagination' => [
                        'page' => 1,
                        'limit' => $totalItems,
                        'totalItems' => $totalItems,
                        'totalPages' => 1,
                    ],
                ], 200);
            }
            
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);
            
            $totalItems = $query->count();
            $totalPages = ceil($totalItems / $limit);
            
            $roles = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $roles,
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
     * Obtiene un rol por su ID
     */
    public function show(string $id): JsonResponse
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json(['error' => 'Rol no encontrado'], 404);
            }

            return response()->json(['data' => $role], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Crea un nuevo rol
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:roles,name',
            ]);

            $role = Role::create($validated);

            return response()->json(['data' => $role], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Actualiza un rol existente
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json(['error' => 'Rol no encontrado'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|unique:roles,name,' . $id,
            ]);

            $role->update($validated);

            return response()->json(['data' => $role], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina un rol existente
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                return response()->json(['error' => 'Rol no encontrado'], 404);
            }

            $role->delete();

            return response()->json(['message' => 'Rol eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

