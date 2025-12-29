<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class RecordController extends Controller
{
    /**
     * Procesa los datos recibidos del webhook
     */
    public function processWebhook(Request $request): JsonResponse
    {
        try {
            $body = $request->all();
            $domuavrainv2 = $body['DOMUAVRAINV2'] ?? null;

            if (!$domuavrainv2) {
                return response()->json(['error' => 'Missing RECORD data'], 400);
            }

            $ip = $request->header('x-forwarded-for') ?: $request->ip() ?: '152.207.242.131';
            $cmd = $domuavrainv2['CMD'] ?? null;
            $id = $domuavrainv2['ID'] ?? null;
            $imei = $domuavrainv2['IMEI'] ?? null;

            if (!$cmd || !$id || !$imei) {
                return response()->json(['error' => 'Missing basic required fields: CMD, ID, IMEI'], 400);
            }

            $time = $domuavrainv2['TIME'] ?? null;
            $vals = $domuavrainv2['VALS'] ?? null;
            $batt = $domuavrainv2['BATT'] ?? null;
            $powr = $domuavrainv2['POWR'] ?? null;
            $sigs = $domuavrainv2['SIGS'] ?? null;
            $nwtype = $domuavrainv2['NWTYPE'] ?? null;
            $val = $domuavrainv2['VAL'] ?? null;

            // Procesar tiempo
            $timeData = $this->parseTime($time);

            // Formatear datos según el tipo de comando
            $formattedData = [
                'ip' => $ip,
                'cmd' => $cmd,
                'phone' => $id,
                'imei' => $imei,
                'time' => $timeData['timeString'],
                'start_time' => $timeData['startTime'],
                'end_time' => $timeData['endTime'],
                'record_date' => $timeData['recordDate'],
                'vals' => '',
                'batt' => $batt ?? '',
                'powr' => $powr ?? '',
                'sigs' => $sigs ?? '',
                'nwtype' => $nwtype ?? '',
            ];

            switch ($cmd) {
                case 'RESULT':
                    $formattedData['vals'] = $vals ? json_encode($vals[0] ?? $vals) : '0.0';
                    break;
                case 'GETCFG':
                    // Solo ID e IMEI
                    break;
                case 'WART':
                    $formattedData['vals'] = json_encode($val ?? 0);
                    break;
            }

            $record = Record::create($formattedData);

            return response()->json(['data' => [$record]], 200);
        } catch (\Exception $e) {
            \Log::error('Error processing webhook: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene registros según los filtros proporcionados
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Record::query();

            if ($request->has('imei')) {
                $query->where('imei', $request->imei);
            }

            if ($request->has('phone')) {
                $query->where('phone', $request->phone);
            }

            if ($request->has('fromDate')) {
                $query->where('record_date', '>=', $request->fromDate);
            }

            if ($request->has('toDate')) {
                $query->where('record_date', '<=', $request->toDate);
            }

            if ($request->has('startTime')) {
                $query->where('start_time', '>=', $request->startTime);
            }

            if ($request->has('endTime')) {
                $query->where('end_time', '<=', $request->endTime);
            }

            if ($request->has('cmd')) {
                $query->where('cmd', $request->cmd);
            }

            if ($request->has('batt')) {
                $query->where('batt', $request->batt);
            }

            if ($request->has('powr')) {
                $query->where('powr', $request->powr);
            }

            if ($request->has('sigs')) {
                $query->where('sigs', $request->sigs);
            }

            if ($request->has('nwtype')) {
                $query->where('nwtype', $request->nwtype);
            }

            if ($request->has('orderBy')) {
                $order = $request->get('order', 'asc');
                $query->orderBy($request->orderBy, $order);
            }

            if ($request->has('limit')) {
                $records = $query->limit($request->limit)->get();
            } else {
                $records = $query->get();
            }

            return response()->json([
                'data' => $records,
                'count' => $records->count(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina registros según los filtros proporcionados
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            $query = Record::query();

            if ($request->has('imei')) {
                $query->where('imei', $request->imei);
            }

            if ($request->has('phone')) {
                $query->where('phone', $request->phone);
            }

            if ($request->has('beforeDate')) {
                $query->where('record_date', '<', $request->beforeDate);
            }

            if ($request->boolean('all')) {
                $count = Record::count();
                Record::truncate();
                return response()->json([
                    'count' => $count,
                    'message' => "Se eliminaron {$count} registros",
                ], 200);
            }

            if (!$request->has('imei') && !$request->has('phone') && !$request->has('beforeDate')) {
                return response()->json([
                    'error' => 'Se requiere al menos un filtro (imei, phone, beforeDate) o all=true',
                ], 400);
            }

            $count = $query->count();
            $query->delete();

            return response()->json([
                'count' => $count,
                'message' => "Se eliminaron {$count} registros",
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Parsea el tiempo del formato HH:MM-HH:MM DD-MM-YYYY o genera el tiempo actual
     */
    private function parseTime(?string $time): array
    {
        if ($time) {
            $timeRegex = '/^(\d{2}:\d{2})-(\d{2}:\d{2}) (\d{2}-\d{2}-\d{4})$/';
            if (preg_match($timeRegex, $time, $matches)) {
                return [
                    'timeString' => $time,
                    'startTime' => $matches[1],
                    'endTime' => $matches[2],
                    'recordDate' => $matches[3],
                ];
            }
        }

        // Generar tiempo actual
        $now = Carbon::now();
        $startTime = $now->format('H:i');
        $endTime = $startTime;
        $recordDate = $now->format('d-m-Y');
        $timeString = "{$startTime}-{$endTime} {$recordDate}";

        return [
            'timeString' => $timeString,
            'startTime' => $startTime,
            'endTime' => $endTime,
            'recordDate' => $recordDate,
        ];
    }

    /**
     * Obtiene los registros de una estación específica con paginación
     */
    public function getStationRecords(Request $request, string $stationId): JsonResponse
    {
        try {
            // Obtener el equipo para obtener el IMEI
            $equipment = \App\Models\Equipment::find($stationId);
            
            if (!$equipment) {
                return response()->json(['error' => 'Estación no encontrada'], 404);
            }

            $query = Record::where('imei', $equipment->imei);

            // Filtros de fecha
            if ($request->has('startDate')) {
                $startDate = $request->get('startDate');
                $query->where(function($q) use ($startDate) {
                    $q->where('record_date', '>=', $startDate)
                      ->orWhere('start_time', '>=', $startDate)
                      ->orWhere('created_at', '>=', $startDate);
                });
            }

            if ($request->has('endDate')) {
                $endDate = $request->get('endDate');
                $query->where(function($q) use ($endDate) {
                    $q->where('record_date', '<=', $endDate)
                      ->orWhere('end_time', '<=', $endDate)
                      ->orWhere('created_at', '<=', $endDate);
                });
            }

            // Paginación
            $page = $request->get('page', 1);
            $limit = $request->get('limit', 50);

            // Contar total
            $total = $query->count();
            $totalPages = ceil($total / $limit);

            // Obtener registros paginados
            $offset = ($page - 1) * $limit;
            $records = $query->orderBy('created_at', 'desc')
                            ->skip($offset)
                            ->take($limit)
                            ->get();

            return response()->json([
                'data' => $records,
                'pagination' => [
                    'page' => (int)$page,
                    'limit' => (int)$limit,
                    'total' => $total,
                    'totalPages' => $totalPages,
                    'hasNextPage' => $page < $totalPages,
                    'hasPrevPage' => $page > 1,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}

