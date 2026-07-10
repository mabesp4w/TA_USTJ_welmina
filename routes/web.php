<?php

use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::inertia('/', 'welcome')->name('home');

    Route::get('login', fn () => redirect(route('home')))->name('login');
    Route::post('login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::inertia('admin/dashboard', 'admin/Dashboard')->name('admin.dashboard');
    Route::get('admin/member', [MemberController::class, 'index'])->name('admin.member');
    Route::post('admin/member', [MemberController::class, 'store'])->name('admin.member.store');
    Route::get('admin/member/{member}', [MemberController::class, 'show'])->name('admin.member.show');
    Route::put('admin/member/{member}', [MemberController::class, 'update'])->name('admin.member.update');
    Route::delete('admin/member/{member}', [MemberController::class, 'destroy'])->name('admin.member.destroy');
    Route::inertia('pengelola/dashboard', 'pengelola/Dashboard')->name('pengelola.dashboard');
    Route::inertia('pimpinan/dashboard', 'pimpinan/Dashboard')->name('pimpinan.dashboard');

    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
});
