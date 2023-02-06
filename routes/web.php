<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/auth/{any}', [\App\Http\Controllers\MyAuthController::class, 'index'])->where('any', '.*');

Route::get('/{any}', [\App\Http\Controllers\IndexController::class, 'index'])->where('any', '.*');

// Route::get('/', function () {
// 	return view('welcome');
// });
