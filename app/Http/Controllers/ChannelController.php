<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChannelController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Channel::query();

            // Búsqueda general
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('variable', 'like', '%' . $search . '%')
                      ->orWhere('col_rel', 'like', '%' . $search . '%');
                });
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');
            
            $sortMap = [
                'createdAt' => 'created_at',
                'name' => 'name',
                'variable' => 'variable',
            ];
            
            $dbSortBy = $sortMap[$sortBy] ?? $sortBy;
            $query->orderBy($dbSortBy, $sortOrder);

            // Paginación - Si se solicita 'all', devolver todos los registros
            if ($request->has('all') && $request->get('all') == 'true') {
                $channels = $query->get();
                $totalItems = $channels->count();
                
                return response()->json([
                    'success' => true,
                    'data' => $channels,
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
            
            $channels = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $channels,
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
            $channel = Channel::find($id);

            if (!$channel) {
                return response()->json(['error' => 'Canal no encontrado'], 404);
            }

            return response()->json(['data' => $channel], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'col_rel' => 'required|string',
                'variable' => 'required|string',
                'unidad_medida' => 'required|string',
                'es_acuifero' => 'sometimes|boolean',
            ]);

            $channel = Channel::create($validated);

            return response()->json(['data' => $channel], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $channel = Channel::find($id);

            if (!$channel) {
                return response()->json(['error' => 'Canal no encontrado'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string',
                'col_rel' => 'sometimes|string',
                'variable' => 'sometimes|string',
                'unidad_medida' => 'sometimes|string',
                'es_acuifero' => 'sometimes|boolean',
            ]);

            $channel->update($validated);

            return response()->json(['data' => $channel], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $channel = Channel::find($id);

            if (!$channel) {
                return response()->json(['error' => 'Canal no encontrado'], 404);
            }

            $channel->delete();

            return response()->json(['message' => 'Canal eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

