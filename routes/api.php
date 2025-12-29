<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\LocalityController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\RecordController;
use App\Http\Middleware\JwtAuth;
use App\Http\Middleware\IsAdmin;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rutas públicas
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Aguas API',
        'version' => '1.0.0',
        'timestamp' => now()->toISOString()
    ], 200);
})->name('api.health');

Route::get('/test', function () {
    return response()->json([
        'message' => 'Hola Tony, esta es una ruta de prueba y como ves el server esta funcionando'
    ], 200);
})->name('api.test');

// Rutas de autenticación (públicas)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware(JwtAuth::class);
});

// Webhook para recibir registros (público)
Route::post('/records/webhook', [RecordController::class, 'processWebhook']);

// Rutas protegidas con JWT
Route::middleware([JwtAuth::class])->group(function () {
    // Usuarios
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [UserController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [UserController::class, 'destroy'])->middleware(IsAdmin::class);
        Route::post('/{id}/reset-password', [UserController::class, 'resetPassword'])->middleware(IsAdmin::class);
    });

    // Roles
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::post('/', [RoleController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [RoleController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [RoleController::class, 'destroy'])->middleware(IsAdmin::class);
    });

    // Provincias
    Route::prefix('provinces')->group(function () {
        Route::get('/', [ProvinceController::class, 'index']);
        Route::get('/{id}', [ProvinceController::class, 'show']);
        Route::post('/', [ProvinceController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [ProvinceController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [ProvinceController::class, 'destroy'])->middleware(IsAdmin::class);
    });

    // Municipios
    Route::prefix('municipalities')->group(function () {
        Route::get('/', [MunicipalityController::class, 'index']);
        Route::get('/{id}', [MunicipalityController::class, 'show']);
        Route::post('/', [MunicipalityController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [MunicipalityController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [MunicipalityController::class, 'destroy'])->middleware(IsAdmin::class);
    });

    // Localidades
    Route::prefix('localities')->group(function () {
        Route::get('/', [LocalityController::class, 'index']);
        Route::get('/{id}', [LocalityController::class, 'show']);
        Route::get('/municipalities/{municipalityId}', [LocalityController::class, 'byMunicipality']);
        Route::post('/', [LocalityController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [LocalityController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [LocalityController::class, 'destroy'])->middleware(IsAdmin::class);
    });

    // Equipos
    Route::prefix('equipment')->group(function () {
        Route::get('/', [EquipmentController::class, 'index']);
        Route::get('/rainfall', [EquipmentController::class, 'rainfall']);
        Route::get('/{id}', [EquipmentController::class, 'show']);
        Route::get('/imei/{imei}', [EquipmentController::class, 'byImei']);
        Route::get('/phone/{phone}', [EquipmentController::class, 'byPhone']);
        Route::get('/locality/{localityId}', [EquipmentController::class, 'byLocality']);
        Route::post('/', [EquipmentController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [EquipmentController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [EquipmentController::class, 'destroy'])->middleware(IsAdmin::class);
    });

    // Canales
    Route::prefix('channels')->group(function () {
        Route::get('/', [ChannelController::class, 'index']);
        Route::get('/{id}', [ChannelController::class, 'show']);
        Route::post('/', [ChannelController::class, 'store'])->middleware(IsAdmin::class);
        Route::put('/{id}', [ChannelController::class, 'update'])->middleware(IsAdmin::class);
        Route::delete('/{id}', [ChannelController::class, 'destroy'])->middleware(IsAdmin::class);
    });

    // Registros
    Route::prefix('records')->group(function () {
        Route::get('/', [RecordController::class, 'index']);
        Route::get('/station/{stationId}', [RecordController::class, 'getStationRecords']);
        Route::delete('/', [RecordController::class, 'destroy'])->middleware(IsAdmin::class);
    });
});
