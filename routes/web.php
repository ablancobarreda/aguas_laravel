<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => null, // Se puede obtener del token si está autenticado
        ],
        'laravelVersion' => app()->version(),
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::post('/login', [AuthController::class, 'login'])->name('login.post');

// Rutas protegidas del dashboard
// Nota: Por ahora no usamos middleware 'auth' de Laravel porque usamos JWT
// Se puede agregar middleware personalizado más adelante
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Index');
})->name('dashboard');

// Estaciones
Route::get('/dashboard/estaciones', function () {
    return Inertia::render('Dashboard/Estaciones/Index');
})->name('dashboard.estaciones');

Route::get('/dashboard/estaciones/{id}/detalles', function ($id) {
    return Inertia::render('Dashboard/Estaciones/Detalles', [
        'stationId' => $id
    ]);
})->name('dashboard.estaciones.detalles');

// Canales
Route::get('/dashboard/canales', function () {
    return Inertia::render('Dashboard/Canales/Index');
})->name('dashboard.canales');

// Usuarios
Route::get('/dashboard/usuarios', function () {
    return Inertia::render('Dashboard/Usuarios/Index');
})->name('dashboard.usuarios');

// Roles
Route::get('/dashboard/roles', function () {
    return Inertia::render('Dashboard/Roles/Index');
})->name('dashboard.roles');

// Ubicación
Route::get('/dashboard/provincias', function () {
    return Inertia::render('Dashboard/Provincias/Index');
})->name('dashboard.provincias');

Route::get('/dashboard/municipios', function () {
    return Inertia::render('Dashboard/Municipios/Index');
})->name('dashboard.municipios');

Route::get('/dashboard/localidades', function () {
    return Inertia::render('Dashboard/Localidades/Index');
})->name('dashboard.localidades');

// Sistema
Route::get('/dashboard/configuracion', function () {
    return Inertia::render('Dashboard/Configuracion/Index');
})->name('dashboard.configuracion');
