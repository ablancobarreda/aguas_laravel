<?php

namespace App\Http\Controllers;

use App\Models\Locality;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LocalityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Locality::with('municipality.province');

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

            if ($request->has('municipality_id') || $request->has('municipalityId')) {
                $municipalityId = $request->get('municipality_id') ?? $request->get('municipalityId');
                $query->where('municipality_id', $municipalityId);
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
                $localities = $query->get();
                $totalItems = $localities->count();
                
                return response()->json([
                    'success' => true,
                    'data' => $localities,
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
            
            $localities = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $localities,
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
            $locality = Locality::with('municipality.province')->find($id);

            if (!$locality) {
                return response()->json(['error' => 'Localidad no encontrada'], 404);
            }

            return response()->json(['data' => $locality], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'municipality_id' => 'required|integer|exists:municipalities,id',
            ]);

            $locality = Locality::create($validated);

            return response()->json(['data' => $locality], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $locality = Locality::find($id);

            if (!$locality) {
                return response()->json(['error' => 'Localidad no encontrada'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string',
                'municipality_id' => 'sometimes|integer|exists:municipalities,id',
            ]);

            $locality->update($validated);

            return response()->json(['data' => $locality], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $locality = Locality::find($id);

            if (!$locality) {
                return response()->json(['error' => 'Localidad no encontrada'], 404);
            }

            $locality->delete();

            return response()->json(['message' => 'Localidad eliminada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function byMunicipality(Request $request, string $municipalityId): JsonResponse
    {
        try {
            $localities = Locality::where('municipality_id', $municipalityId)->get();

            return response()->json([
                'data' => $localities,
                'count' => $localities->count(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

