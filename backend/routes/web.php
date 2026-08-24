<?php

use Illuminate\Support\Facades\Route;



Route::get('/{any}', function () {
    $path = public_path('frontend/index.html');
    if (!file_exists($path)) {
        return "Frontend build not found. Please run 'npm run build' in the frontend directory.";
    }
    return file_get_contents($path);
})->where('any', '^(?!api).*$');
