<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GymEquipmentController;
use App\Http\Controllers\Admin\GymFeeController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\MaintenanceLogController;
use App\Http\Controllers\Admin\MemberController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\ProcurementController;
use App\Http\Controllers\Admin\RegistrationPaymentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::inertia('/', 'welcome')->name('home');

    Route::get('login', fn () => redirect(route('home')))->name('login');
    Route::post('login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('admin/member', [MemberController::class, 'index'])->name('admin.member');
    Route::post('admin/member', [MemberController::class, 'store'])->name('admin.member.store');
    Route::get('admin/member/{member}', [MemberController::class, 'show'])->name('admin.member.show');
    Route::put('admin/member/{member}', [MemberController::class, 'update'])->name('admin.member.update');
    Route::delete('admin/member/{member}', [MemberController::class, 'destroy'])->name('admin.member.destroy');

    Route::get('admin/registration-payment', [RegistrationPaymentController::class, 'index'])->name('admin.registration-payment');
    Route::post('admin/registration-payment', [RegistrationPaymentController::class, 'store'])->name('admin.registration-payment.store');
    Route::get('admin/registration-payment/{registrationPayment}', [RegistrationPaymentController::class, 'show'])->name('admin.registration-payment.show');
    Route::put('admin/registration-payment/{registrationPayment}', [RegistrationPaymentController::class, 'update'])->name('admin.registration-payment.update');
    Route::delete('admin/registration-payment/{registrationPayment}', [RegistrationPaymentController::class, 'destroy'])->name('admin.registration-payment.destroy');

    Route::get('admin/gym-fee', [GymFeeController::class, 'index'])->name('admin.gym-fee');
    Route::post('admin/gym-fee', [GymFeeController::class, 'store'])->name('admin.gym-fee.store');
    Route::get('admin/gym-fee/{gymFee}', [GymFeeController::class, 'show'])->name('admin.gym-fee.show');
    Route::put('admin/gym-fee/{gymFee}', [GymFeeController::class, 'update'])->name('admin.gym-fee.update');
    Route::delete('admin/gym-fee/{gymFee}', [GymFeeController::class, 'destroy'])->name('admin.gym-fee.destroy');

    Route::get('admin/gym-equipment', [GymEquipmentController::class, 'index'])->name('admin.gym-equipment');
    Route::post('admin/gym-equipment', [GymEquipmentController::class, 'store'])->name('admin.gym-equipment.store');
    Route::get('admin/gym-equipment/{gymEquipment}', [GymEquipmentController::class, 'show'])->name('admin.gym-equipment.show');
    Route::put('admin/gym-equipment/{gymEquipment}', [GymEquipmentController::class, 'update'])->name('admin.gym-equipment.update');
    Route::delete('admin/gym-equipment/{gymEquipment}', [GymEquipmentController::class, 'destroy'])->name('admin.gym-equipment.destroy');

    Route::get('admin/supplier', [SupplierController::class, 'index'])->name('admin.supplier');
    Route::post('admin/supplier', [SupplierController::class, 'store'])->name('admin.supplier.store');
    Route::get('admin/supplier/{supplier}', [SupplierController::class, 'show'])->name('admin.supplier.show');
    Route::put('admin/supplier/{supplier}', [SupplierController::class, 'update'])->name('admin.supplier.update');
    Route::delete('admin/supplier/{supplier}', [SupplierController::class, 'destroy'])->name('admin.supplier.destroy');

    Route::get('admin/procurement', [ProcurementController::class, 'index'])->name('admin.procurement');
    Route::post('admin/procurement', [ProcurementController::class, 'store'])->name('admin.procurement.store');
    Route::get('admin/procurement/{procurement}', [ProcurementController::class, 'show'])->name('admin.procurement.show');
    Route::put('admin/procurement/{procurement}', [ProcurementController::class, 'update'])->name('admin.procurement.update');
    Route::delete('admin/procurement/{procurement}', [ProcurementController::class, 'destroy'])->name('admin.procurement.destroy');

    Route::get('admin/activity-log', [ActivityLogController::class, 'index'])->name('admin.activity-log');
    Route::get('admin/activity-log/{activityLog}', [ActivityLogController::class, 'show'])->name('admin.activity-log.show');
    Route::delete('admin/activity-log/{activityLog}', [ActivityLogController::class, 'destroy'])->name('admin.activity-log.destroy');

    Route::get('admin/inventory', [InventoryController::class, 'index'])->name('admin.inventory');
    Route::post('admin/inventory', [InventoryController::class, 'store'])->name('admin.inventory.store');
    Route::get('admin/inventory/{inventory}', [InventoryController::class, 'show'])->name('admin.inventory.show');
    Route::put('admin/inventory/{inventory}', [InventoryController::class, 'update'])->name('admin.inventory.update');
    Route::delete('admin/inventory/{inventory}', [InventoryController::class, 'destroy'])->name('admin.inventory.destroy');

    Route::get('admin/maintenance-logs', [MaintenanceLogController::class, 'index'])->name('admin.maintenance-logs');
    Route::post('admin/maintenance-logs', [MaintenanceLogController::class, 'store'])->name('admin.maintenance-logs.store');
    Route::get('admin/maintenance-logs/{maintenanceLog}', [MaintenanceLogController::class, 'show'])->name('admin.maintenance-logs.show');
    Route::put('admin/maintenance-logs/{maintenanceLog}', [MaintenanceLogController::class, 'update'])->name('admin.maintenance-logs.update');
    Route::delete('admin/maintenance-logs/{maintenanceLog}', [MaintenanceLogController::class, 'destroy'])->name('admin.maintenance-logs.destroy');

    Route::get('admin/report', [ReportController::class, 'index'])->name('admin.report');
    Route::get('admin/report/barang', [ReportController::class, 'barang'])->name('admin.report.barang');
    Route::get('admin/report/barang/pdf', [ReportController::class, 'barangPdf'])->name('admin.report.barang.pdf');
    Route::get('admin/report/barang/excel', [ReportController::class, 'barangExcel'])->name('admin.report.barang.excel');
    Route::get('admin/report/keuangan', [ReportController::class, 'keuangan'])->name('admin.report.keuangan');
    Route::get('admin/report/keuangan/pdf', [ReportController::class, 'keuanganPdf'])->name('admin.report.keuangan.pdf');
    Route::get('admin/report/keuangan/excel', [ReportController::class, 'keuanganExcel'])->name('admin.report.keuangan.excel');
    Route::get('admin/report/harian', [ReportController::class, 'harian'])->name('admin.report.harian');
    Route::get('admin/report/harian/pdf', [ReportController::class, 'harianPdf'])->name('admin.report.harian.pdf');
    Route::get('admin/report/harian/excel', [ReportController::class, 'harianExcel'])->name('admin.report.harian.excel');

    Route::get('admin/notification', [NotificationController::class, 'index'])->name('admin.notification');
    Route::get('admin/notification/{notification}', [NotificationController::class, 'show'])->name('admin.notification.show');
    Route::post('admin/notification/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('admin.notification.mark-all-read');
    Route::delete('admin/notification/{notification}', [NotificationController::class, 'destroy'])->name('admin.notification.destroy');

    Route::get('admin/user', [UserController::class, 'index'])->name('admin.user');
    Route::post('admin/user', [UserController::class, 'store'])->name('admin.user.store');
    Route::get('admin/user/{user}', [UserController::class, 'show'])->name('admin.user.show');
    Route::put('admin/user/{user}', [UserController::class, 'update'])->name('admin.user.update');
    Route::delete('admin/user/{user}', [UserController::class, 'destroy'])->name('admin.user.destroy');

    Route::inertia('pengelola/dashboard', 'pengelola/Dashboard')->name('pengelola.dashboard');
    Route::inertia('pimpinan/dashboard', 'pimpinan/Dashboard')->name('pimpinan.dashboard');

    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
});
