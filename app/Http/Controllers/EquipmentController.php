<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Equipment::with(['locality.municipality.province', 'channels']);

            // Búsqueda general
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('id', 'like', '%' . $search . '%')
                      ->orWhere('location', 'like', '%' . $search . '%')
                      ->orWhere('imei', 'like', '%' . $search . '%')
                      ->orWhere('phone', 'like', '%' . $search . '%')
                      ->orWhere('basin', 'like', '%' . $search . '%');
                });
            }

            if ($request->has('id')) {
                $query->where('id', $request->id);
            }

            if ($request->has('location')) {
                $query->where('location', 'like', '%' . $request->location . '%');
            }

            if ($request->has('imei')) {
                $query->where('imei', $request->imei);
            }

            if ($request->has('phone')) {
                $query->where('phone', $request->phone);
            }

            if ($request->has('basin')) {
                $query->where('basin', $request->basin);
            }

            if ($request->has('locality_id')) {
                $query->where('locality_id', $request->locality_id);
            }

            // Ordenamiento
            $sortBy = $request->get('sortBy', 'created_at');
            $sortOrder = $request->get('sortOrder', 'desc');

            // Mapear campos de frontend a campos de BD
            $sortMap = [
                'createdAt' => 'created_at',
                'id' => 'id',
                'location' => 'location',
                'imei' => 'imei',
                'phone' => 'phone',
            ];

            $dbSortBy = $sortMap[$sortBy] ?? $sortBy;
            $query->orderBy($dbSortBy, $sortOrder);

            // Paginación
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 10);

            $totalItems = $query->count();
            $totalPages = ceil($totalItems / $limit);

            $equipment = $query->skip(($page - 1) * $limit)->take($limit)->get();

            return response()->json([
                'success' => true,
                'data' => $equipment,
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
            $equipment = Equipment::with(['locality.municipality.province', 'channels'])->find($id);

            if (!$equipment) {
                return response()->json(['error' => 'Equipo no encontrado'], 404);
            }

            return response()->json(['data' => $equipment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'id' => 'required|string|unique:equipment,id',
                'imei' => 'required|string',
                'phone' => 'required|string',
                'location' => 'nullable|string',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'basin' => 'nullable|string',
                'locality_id' => 'nullable|integer|exists:localities,id',
                'channel' => 'nullable|array',
                'channel_ids' => 'nullable|array',
            ]);

            $channelIds = $validated['channel_ids'] ?? $validated['channel'] ?? [];
            unset($validated['channel'], $validated['channel_ids']);

            $equipment = Equipment::create($validated);

            if (!empty($channelIds)) {
                $equipment->channels()->sync($channelIds);
            }

            return response()->json(['data' => $equipment->load('channels')], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $equipment = Equipment::find($id);

            if (!$equipment) {
                return response()->json(['error' => 'Equipo no encontrado'], 404);
            }

            $validated = $request->validate([
                'location' => 'sometimes|string',
                'latitude' => 'sometimes|numeric',
                'longitude' => 'sometimes|numeric',
                'imei' => 'sometimes|string',
                'phone' => 'sometimes|string',
                'basin' => 'sometimes|string',
                'locality_id' => 'sometimes|integer|exists:localities,id',
                'channel' => 'sometimes|array',
                'channel_ids' => 'sometimes|array',
            ]);

            $channelIds = $validated['channel_ids'] ?? $validated['channel'] ?? null;
            unset($validated['channel'], $validated['channel_ids']);

            $equipment->update($validated);

            if ($channelIds !== null) {
                $equipment->channels()->sync($channelIds);
            }

            return response()->json(['data' => $equipment->load('channels')], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $equipment = Equipment::find($id);

            if (!$equipment) {
                return response()->json(['error' => 'Equipo no encontrado'], 404);
            }

            $equipment->delete();

            return response()->json(['message' => 'Equipo eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function byImei(string $imei): JsonResponse
    {
        try {
            $equipment = Equipment::with(['locality', 'channels'])
                ->where('imei', $imei)
                ->first();

            if (!$equipment) {
                return response()->json(['error' => 'Equipo no encontrado'], 404);
            }

            return response()->json(['data' => $equipment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function byPhone(string $phone): JsonResponse
    {
        try {
            $equipment = Equipment::with(['locality', 'channels'])
                ->where('phone', $phone)
                ->first();

            if (!$equipment) {
                return response()->json(['error' => 'Equipo no encontrado'], 404);
            }

            return response()->json(['data' => $equipment], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function byLocality(string $localityId): JsonResponse
    {
        try {
            $equipment = Equipment::with(['locality', 'channels'])
                ->where('locality_id', $localityId)
                ->get();

            return response()->json([
                'data' => $equipment,
                'count' => $equipment->count(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene todos los equipos con sus últimos valores de lluvia
     */
    public function rainfall(): JsonResponse
    {
        try {
            $equipments = Equipment::with(['locality.municipality.province', 'channels'])
                ->orderBy('id', 'asc')
                ->get();

            $equipmentsWithData = $equipments->map(function ($equipment) {
                // Obtener el último registro para este equipo
                $latestRecord = \App\Models\Record::where('imei', $equipment->imei)
                    ->orderBy('record_date', 'desc')
                    ->orderBy('start_time', 'desc')
                    ->first();

                // Procesar canales con sus valores
                $channelsWithValues = $equipment->channels->map(function ($channel) use ($latestRecord, $equipment) {
                    $value = null;
                    $timeInfo = null;

                    // Determinar el valor según el tipo de canal
                    if ($latestRecord) {
                        $colRel = $channel->col_rel;

                        // Para canales de lluvia específicos, calcular acumulados
                        if ($channel->name === '03') {
                            // Acumulado diario de lluvia (de 7am a 7am)
                            $value = $this->calculateDailyRainfallAccumulation($equipment->imei, $colRel);
                            $now = now();
                            $startDate = $now->copy();
                            if ($now->hour < 7) {
                                $startDate->subDay();
                            }
                            $startDate->setTime(7, 0, 0);

                            $endDate = $now->copy();
                            if ($now->hour >= 7) {
                                $endDate->addDay();
                            }
                            $endDate->setTime(7, 0, 0);

                            $timeInfo = sprintf(
                                '07:00 - %d-%d/%d/%d',
                                $startDate->day,
                                $endDate->day,
                                $startDate->month,
                                $startDate->year
                            );
                        } elseif ($channel->name === '05') {
                            // Acumulado actual (7am día anterior a 7am día actual)
                            $value = $this->calculateCurrentDailyRainfallAccumulation($equipment->imei, $colRel);
                            $now = now();
                            $startDate = $now->copy()->subDay()->setTime(7, 0, 0);
                            $endDate = $now->copy()->setTime(7, 0, 0);

                            $timeInfo = sprintf(
                                '07:00 - %d-%d/%d/%d',
                                $startDate->day,
                                $endDate->day,
                                $startDate->month,
                                $endDate->year
                            );
                        } elseif ($channel->name === '02') {
                            // Acumulado última hora
                            $hourlyData = $this->calculateLastHourRainfallAccumulation($equipment->imei, $colRel);
                            $value = $hourlyData['value'];
                            $timeInfo = $hourlyData['timeRange'];
                        } else {
                            // Para otros canales, parsear vals (JSON) y obtener el valor
                            $vals = json_decode($latestRecord->vals, true);
                            if (is_array($vals)) {
                                $value = $vals[$colRel] ?? null;
                            } elseif (is_numeric($vals)) {
                                // Si vals es un número directo, usarlo
                                $value = $vals;
                            } else {
                                $value = null;
                            }

                            if ($latestRecord->start_time && $latestRecord->end_time && $latestRecord->record_date) {
                                $timeInfo = sprintf(
                                    '%s-%s %s',
                                    $latestRecord->start_time,
                                    $latestRecord->end_time,
                                    $latestRecord->record_date
                                );
                            } else {
                                $timeInfo = $latestRecord->time ?? null;
                            }
                        }
                    }

                    return [
                        'id' => $channel->id,
                        'name' => $channel->name,
                        'col_rel' => $channel->col_rel,
                        'variable' => $channel->variable,
                        'unidad_medida' => $channel->unidad_medida,
                        'es_acuifero' => $channel->es_acuifero,
                        'latest_value' => $value,
                        'time_info' => $timeInfo,
                    ];
                });

                // Formatear fecha del último registro
                $lastRecordDate = null;
                if ($latestRecord && $latestRecord->start_time && $latestRecord->end_time && $latestRecord->record_date) {
                    $lastRecordDate = sprintf(
                        '%s-%s %s',
                        $latestRecord->start_time,
                        $latestRecord->end_time,
                        $latestRecord->record_date
                    );
                }

                return [
                    'id' => $equipment->id,
                    'location' => $equipment->location,
                    'latitude' => $equipment->latitude ? (string)$equipment->latitude : null,
                    'longitude' => $equipment->longitude ? (string)$equipment->longitude : null,
                    'imei' => $equipment->imei,
                    'phone' => $equipment->phone,
                    'basin' => $equipment->basin,
                    'locality_id' => $equipment->locality_id,
                    'channels' => $channelsWithValues,
                    'channel_ids' => $channelsWithValues->pluck('id')->toArray(),
                    'last_record_date' => $lastRecordDate,
                    'battery' => $latestRecord->batt ?? null,
                    'signal' => $latestRecord->sigs ?? null,
                    'power' => $latestRecord->powr ?? null,
                    'network_type' => $latestRecord->nwtype ?? null,
                    'locality' => $equipment->locality ? [
                        'id' => $equipment->locality->id,
                        'name' => $equipment->locality->name,
                        'municipality' => $equipment->locality->municipality ? [
                            'id' => $equipment->locality->municipality->id,
                            'name' => $equipment->locality->municipality->name,
                            'province' => $equipment->locality->municipality->province ? [
                                'id' => $equipment->locality->municipality->province->id,
                                'name' => $equipment->locality->municipality->province->name,
                            ] : null,
                        ] : null,
                    ] : null,
                    'locality_name' => $equipment->locality->name ?? null,
                    'municipality_name' => $equipment->locality->municipality->name ?? null,
                    'province_name' => $equipment->locality->municipality->province->name ?? null,
                ];
            });

            return response()->json([
                'data' => $equipmentsWithData,
                'count' => $equipmentsWithData->count(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Calcula el acumulado diario de lluvia (de 7am a 7am)
     */
    private function calculateDailyRainfallAccumulation(string $imei, string $colRel): ?float
    {
        try {
            $now = now();
            $startDate = $now->copy();
            if ($now->hour < 7) {
                $startDate->subDay();
            }
            $startDate->setTime(7, 0, 0);

            $endDate = $now->copy();
            if ($now->hour >= 7) {
                $endDate->addDay();
            }
            $endDate->setTime(7, 0, 0);

            $records = \App\Models\Record::where('imei', $imei)
                ->whereBetween('record_date', [$startDate->format('d-m-Y'), $endDate->format('d-m-Y')])
                ->whereNotNull('vals')
                ->get();

            $accumulation = 0;
            foreach ($records as $record) {
                $vals = json_decode($record->vals, true);
                if (is_array($vals) && isset($vals[$colRel])) {
                    $accumulation += (float)($vals[$colRel] ?? 0);
                } elseif (is_numeric($vals)) {
                    $accumulation += (float)$vals;
                }
            }

            return $accumulation > 0 ? round($accumulation, 2) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Calcula el acumulado actual (7am día anterior a 7am día actual)
     */
    private function calculateCurrentDailyRainfallAccumulation(string $imei, string $colRel): ?float
    {
        try {
            $now = now();
            $startDate = $now->copy()->subDay()->setTime(7, 0, 0);
            $endDate = $now->copy()->setTime(7, 0, 0);

            $records = \App\Models\Record::where('imei', $imei)
                ->whereBetween('record_date', [$startDate->format('d-m-Y'), $endDate->format('d-m-Y')])
                ->whereNotNull('vals')
                ->get();

            $accumulation = 0;
            foreach ($records as $record) {
                $vals = json_decode($record->vals, true);
                if (is_array($vals) && isset($vals[$colRel])) {
                    $accumulation += (float)($vals[$colRel] ?? 0);
                } elseif (is_numeric($vals)) {
                    $accumulation += (float)$vals;
                }
            }

            return $accumulation > 0 ? round($accumulation, 2) : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Calcula el acumulado de la última hora cerrada
     */
    private function calculateLastHourRainfallAccumulation(string $imei, string $colRel): array
    {
        try {
            $now = now();
            $lastHour = $now->copy()->subHour();
            $hourStart = $lastHour->copy()->startOfHour();
            $hourEnd = $lastHour->copy()->endOfHour();

            $records = \App\Models\Record::where('imei', $imei)
                ->where('record_date', $lastHour->format('d-m-Y'))
                ->whereNotNull('vals')
                ->where(function($query) use ($hourStart, $hourEnd) {
                    $query->whereBetween('start_time', [$hourStart->format('H:i'), $hourEnd->format('H:i')])
                          ->orWhereBetween('end_time', [$hourStart->format('H:i'), $hourEnd->format('H:i')]);
                })
                ->get();

            $accumulation = 0;
            foreach ($records as $record) {
                $vals = json_decode($record->vals, true);
                if (is_array($vals) && isset($vals[$colRel])) {
                    $accumulation += (float)($vals[$colRel] ?? 0);
                } elseif (is_numeric($vals)) {
                    $accumulation += (float)$vals;
                }
            }

            $value = $accumulation > 0 ? round($accumulation, 2) : null;

            $timeRange = sprintf(
                '%s-%s %s',
                $hourStart->format('H:i'),
                $hourEnd->format('H:i'),
                $lastHour->format('d/m/Y')
            );

            return [
                'value' => $value,
                'timeRange' => $timeRange,
            ];
        } catch (\Exception $e) {
            return [
                'value' => null,
                'timeRange' => null,
            ];
        }
    }
}

