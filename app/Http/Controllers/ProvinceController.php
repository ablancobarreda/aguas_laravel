<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProvinceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Province::query();

            // Búsqueda general
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where('name', 'like', '%' . $search . '%');
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
                $provinces = $query->get();
                $totalItems = $provinces->count();
                
                return response()->json([
                    'success' => true,
                    'data' => $provinces,
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
            
            $provinces = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $provinces,
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

    public function show(string $id): JsonResponse
    {
        try {
            $province = Province::find($id);

            if (!$province) {
                return response()->json(['error' => 'Provincia no encontrada'], 404);
            }

            return response()->json(['data' => $province], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
            ]);

            $province = Province::create($validated);

            return response()->json(['data' => $province], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $province = Province::find($id);

            if (!$province) {
                return response()->json(['error' => 'Provincia no encontrada'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string',
            ]);

            $province->update($validated);

            return response()->json(['data' => $province], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $province = Province::find($id);

            if (!$province) {
                return response()->json(['error' => 'Provincia no encontrada'], 404);
            }

            $province->delete();

            return response()->json(['message' => 'Provincia eliminada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

