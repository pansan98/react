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

Route::get('/auth/social/{provider}', [\App\Http\Controllers\Api\SocialAuthController::class, 'receive'])->where(['provider' => '[a-zA-Z]+']);

Route::get('/auth/{any}', [\App\Http\Controllers\MyAuthController::class, 'index'])->where('any', '.*')->middleware('my.member');

Route::get('/{any}', [\App\Http\Controllers\IndexController::class, 'index'])->where('any', '.*')->middleware('my.auth');

// Route::get('/', function () {
// 	return view('welcome');
// });
