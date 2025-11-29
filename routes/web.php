<?php

use App\Http\Controllers\communitiesController;
use App\Http\Controllers\superadmin\communitiesController as SuperadminCommunitiesController;
use App\Http\Controllers\dashboardController;
use App\Http\Controllers\superadmin\usersController as SuperadminUsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [dashboardController::class, 'index'])->name('dashboard');
    Route::get('communities', [communitiesController::class, 'index'])->name('communities.index');
    Route::get('communities/create', [communitiesController::class, 'create'])->name('communities.create');
    Route::post('communities/create', [communitiesController::class, 'store'])->name('communities.store');
    Route::get('communities/{id}/edit', [communitiesController::class, 'edit'])->name('communities.edit');
    Route::put('communities/{id}/update', [communitiesController::class, 'update'])->name('communities.update');
    Route::delete('communities/{id}/delete', [communitiesController::class, 'delete'])->name('communities.delete');

    Route::middleware(['superadmin'])->group(function () {
        Route::prefix('superadmin')->group(function () {
            Route::get('/users', [SuperadminUsersController::class, 'index'])->name('superadmin.users.index');
            Route::get('/users/{id}/edit', [SuperadminUsersController::class, 'edit'])->name('superadmin.users.edit');
            Route::put('/users/{id}/update', [SuperadminUsersController::class, 'update'])->name('superadmin.users.update');
            Route::get('/communities', [SuperadminCommunitiesController::class, 'index'])->name('superadmin.communities.index');
        });
    });
});


require __DIR__ . '/settings.php';
