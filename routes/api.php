<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('ps')->as('ps')->group(function() {
    Route::prefix('stop-watch')->as('stop_watch')->group(function() {
        Route::get('/', [\App\Http\Controllers\Api\PS\StopWatchController::class, 'index']);
        Route::post('/save', [\App\Http\Controllers\Api\PS\StopWatchController::class, 'save']);
        Route::post('/destroy/{id}', [\App\Http\Controllers\Api\PS\StopWatchController::class, 'destroy'])->where(['id' => '[0-9]+']);
    });
});