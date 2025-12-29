<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MunicipalityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Municipality::with('province');

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

            if ($request->has('province_id') || $request->has('provinceId')) {
                $provinceId = $request->get('province_id') ?? $request->get('provinceId');
                $query->where('province_id', $provinceId);
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
                $municipalities = $query->get();
                $totalItems = $municipalities->count();
                
                return response()->json([
                    'success' => true,
                    'data' => $municipalities,
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
            
            $municipalities = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $municipalities,
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
            $municipality = Municipality::with('province')->find($id);

            if (!$municipality) {
                return response()->json(['error' => 'Municipio no encontrado'], 404);
            }

            return response()->json(['data' => $municipality], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'province_id' => 'required|integer|exists:provinces,id',
            ]);

            $municipality = Municipality::create($validated);

            return response()->json(['data' => $municipality], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $municipality = Municipality::find($id);

            if (!$municipality) {
                return response()->json(['error' => 'Municipio no encontrado'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string',
                'province_id' => 'sometimes|integer|exists:provinces,id',
            ]);

            $municipality->update($validated);

            return response()->json(['data' => $municipality], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $municipality = Municipality::find($id);

            if (!$municipality) {
                return response()->json(['error' => 'Municipio no encontrado'], 404);
            }

            $municipality->delete();

            return response()->json(['message' => 'Municipio eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

