<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DepartmentsController;

Route::get('/', function() {
    return redirect()->route('login');
})->middleware(['auth', 'verified']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('role:admin')->group(function () {

        Route::prefix('users')->name('users.')->controller(UserController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/', 'store')->name('store');
                Route::put('{user}', 'update')->name('update');
                Route::delete('{user}', 'destroy')->name('destroy');
                Route::patch('{user}/toggle-active', 'toggleActive')->name('toggle-active');
            }
        );

        Route::prefix('departments')->name('departments.')->controller(DepartmentsController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/', 'store')->name('store');
                Route::put('{department}', 'update')->name('update');
                Route::delete('{department}', 'destroy')->name('destroy');
                Route::patch('{department}/toggle-active', 'toggleActive')->name('toggle-active');
            }
        );

        Route::prefix('systems')->name('systems.')->controller(SystemController::class)
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/', 'store')->name('store');
                Route::put('{system}', 'update')->name('update');
                Route::delete('{system}', 'destroy')->name('destroy');
                Route::patch('{system}/toggle-active', 'toggleActive')->name('toggle-active');
            }
        );

    });
        
    Route::prefix('tickets')->name('tickets.')->controller(TicketController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{ticket}', 'update')->name('update');
            Route::delete('{ticket}', 'destroy')->name('destroy');
        }
    );
});

require __DIR__.'/auth.php';
