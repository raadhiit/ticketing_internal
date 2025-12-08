<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TasksController;
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

    Route::prefix('users')
        ->name('users.')
        ->middleware('permission:users.manage')
        ->controller(UserController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{user}', 'update')->name('update');
            Route::delete('{user}', 'destroy')->name('destroy');
            Route::patch('{user}/toggle-active', 'toggleActive')->name('toggle-active');
        });

    Route::prefix('departments')
        ->name('departments.')
        ->middleware('permission:departments.manage')
        ->controller(DepartmentsController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{department}', 'update')->name('update');
            Route::delete('{department}', 'destroy')->name('destroy');
            Route::patch('{department}/toggle-active', 'toggleActive')->name('toggle-active');
        });

    Route::prefix('systems')
        ->name('systems.')
        ->middleware('permission:systems.manage')
        ->controller(SystemController::class)
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('{system}', 'update')->name('update');
            Route::delete('{system}', 'destroy')->name('destroy');
            Route::patch('{system}/toggle-active', 'toggleActive')->name('toggle-active');
        });

    Route::prefix('tickets')->name('tickets.')->group(function () {
        Route::controller(TicketController::class)->group(function () {
           Route::get('/', 'index')->name('index');
           Route::post('/', 'store')->middleware('permission:tickets.create')->name('store');
           Route::put('{ticket}', 'update')->middleware('permission:tickets.update-status|tickets.assign|tickets.set-priority')->name('update');
           Route::delete('{ticket}', 'destroy')->middleware('permission:tickets.delete')->name('destroy');
        });

        Route::middleware('permission:tickets.view.all|tickets.view.assigned')->group(function () {
            Route::get('{ticket}', [TicketController::class, 'show'])->name('show');

            Route::prefix('{ticket}/tasks')->name('tasks.')->controller(TasksController::class)
                ->group(function () {
                    Route::post('/', 'store')
                        ->middleware('permission:tasks.manage-all|tasks.manage-assigned|tasks.create|tasks.update|tasks.delete')
                        ->name('store');

                    Route::put('{task}', 'update')
                        ->middleware('permission:tasks.manage-all|tasks.manage-assigned|tasks.create|tasks.update|tasks.delete')
                        ->name('update');

                    Route::delete('{task}', 'destroy')
                        ->middleware('permission:tasks.manage-all|tasks.manage-assigned|tasks.create|tasks.update|tasks.delete')
                        ->name('destroy');

                    Route::post('/reorder', 'reorder')
                        ->middleware('permission:tasks.manage-all|tasks.manage-assigned|tasks.create|tasks.update|tasks.delete')
                        ->name('reorder');
                }
            );
        });
    });


});

require __DIR__.'/auth.php';
