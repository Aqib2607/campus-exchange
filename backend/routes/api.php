<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'me']);
    Route::get('/users/me', [AuthController::class, 'me']);

    // Products (Student)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::patch('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/products/{product}/favorite', [FavoriteController::class, 'store']);
    Route::delete('/products/{product}/favorite', [FavoriteController::class, 'destroy']);

    // Requests
    Route::get('/requests/sent', [PurchaseRequestController::class, 'sent']);
    Route::get('/requests/received', [PurchaseRequestController::class, 'received']);
    Route::post('/products/{product}/requests', [PurchaseRequestController::class, 'store']);
    Route::patch('/requests/{purchaseRequest}/accept', [PurchaseRequestController::class, 'accept']);
    Route::patch('/requests/{purchaseRequest}/reject', [PurchaseRequestController::class, 'reject']);

    // Conversations & Messages
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);

    // Reports
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/mine', [ReportController::class, 'mine']);

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/statistics', [AdminController::class, 'statistics']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/block', [AdminController::class, 'blockUser']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/products', [AdminController::class, 'products']);
        Route::delete('/products/{product}', [AdminController::class, 'deleteProduct']);

        Route::get('/reports', [AdminController::class, 'reports']);
        Route::patch('/reports/{report}/resolve', [AdminController::class, 'resolveReport']);
    });
});
