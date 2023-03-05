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

Route::prefix('auth')->as('auth')->group(function() {
	Route::post('/login', [\App\Http\Controllers\Api\MyAuthController::class, 'login']);
	Route::post('/logout', [\App\Http\Controllers\Api\MyAuthController::class, 'logout']);
	Route::post('/register', [\App\Http\Controllers\Api\MyAuthController::class, 'register']);
	Route::post('/forgot', [\App\Http\Controllers\Api\MyAuthController::class, 'forgot']);
	Route::post('/profile', [\App\Http\Controllers\Api\MyAuthController::class, 'profile']);
	Route::post('/profile/thumbnail/destroy', [\App\Http\Controllers\Api\MyAuthController::class, 'thumbnail_destroy']);
	Route::get('/user', [\App\Http\Controllers\Api\MyAuthController::class, 'user']);
	Route::get('/user/labels', [\App\Http\Controllers\Api\MyAuthController::class, 'labels']);
	
	Route::prefix('sharing')->as('sharing')->group(function() {
		Route::post('/use', [\App\Http\Controllers\Api\MySharingController::class, 'use']);
		Route::post('/approval/{token}', function() {
			return view('welcome');
		});
	});

	Route::get('/social/redirect/{provider}', [\App\Http\Controllers\Api\SocialAuthController::class, 'redirect'])->where(['provider' => '[a-zA-Z]+']);
	
	Route::post('/authorize/{identify}/{token}', [\App\Http\Controllers\Api\MyAuthController::class, 'certification'])
		->where([
			'identify' => '[a-zA-Z0-9]+'
		]);
	
	Route::post('/password/reset/{identify}/{token}', [\App\Http\Controllers\Api\MyAuthController::class, 'p_reset'])
		->where([
			'identify' => '[a-zA-Z0-9]+'
		]);
	Route::post('/password/authorize/{identify}/{token}', [\App\Http\Controllers\Api\MyAuthController::class, 'p_authorize'])
		->where([
			'identify' => '[a-zA-Z0-9]+'
		]);
});

Route::prefix('shop')->as('shop')->group(function() {
	Route::get('/history', [\App\Http\Controllers\Api\ShopHistoryController::class, 'index']);
	Route::get('/products', [\App\Http\Controllers\Api\ShopProductController::class, 'products']);
	Route::get('/product/{identify}', [\App\Http\Controllers\Api\ShopProductController::class, 'product'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
	Route::post('/product/destroy/{identify}', [\App\Http\Controllers\Api\ShopProductController::class, 'destroy'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
	Route::post('/create', [\App\Http\Controllers\Api\ShopProductController::class, 'create']);
	Route::post('/edit/{identify}', [\App\Http\Controllers\Api\ShopProductController::class, 'edit'])->where(['identify' => '[a-zA-Z0-9\-_]+']);

	Route::prefix('review')->as('review')->group(function() {
		Route::get('/product/{identify}', [\App\Http\Controllers\Api\ShopReviewController::class, 'product'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
		Route::post('/create/{identify}', [\App\Http\Controllers\Api\ShopReviewController::class, 'create'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
	});

	Route::prefix('ec')->as('ec')->group(function() {
		Route::get('/products', [\App\Http\Controllers\Api\ShopEcProductController::class, 'products']);
		Route::get('/product/{identify}', [\App\Http\Controllers\Api\ShopEcProductController::class, 'product'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
	});

	Route::prefix('cart')->as('cart')->group(function() {
		Route::post('/add/{identify}', [\App\Http\Controllers\Api\ShopCartController::class, 'add'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
		Route::post('/remove/{identify}', [\App\Http\Controllers\Api\ShopCartController::class, 'remove'])->where(['indentify' => '[a-zA-Z0-9\-_]+']);
		Route::post('/pay', [\App\Http\Controllers\Api\ShopCartController::class, 'pay']);
		Route::get('/my', [\App\Http\Controllers\Api\ShopCartController::class, 'cart']);
	});

	Route::prefix('favorite')->as('favorite')->group(function() {
		Route::post('/add/{identify}', [\App\Http\Controllers\Api\ShopFavoritesController::class, 'add'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
		Route::post('/remove/{identify}', [\App\Http\Controllers\Api\ShopFavoritesController::class, 'remove'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
		Route::get('/favorites', [\App\Http\Controllers\Api\ShopFavoritesController::class, 'favorites']);
		Route::get('/folders', [\App\Http\Controllers\Api\ShopFavoritesController::class, 'folders']);
		Route::post('/folder/create', [\App\Http\Controllers\Api\ShopFavoritesController::class, 'folder_create']);
		Route::post('/folder/{folder_id}', [\App\Http\Controllers\Api\ShopFavoritesController::class, 'folder']);
	});

	Route::prefix('views')->as('views')->group(function() {
		Route::get('/{identify}/history', [\App\Http\Controllers\Api\ShopViewsController::class, 'history'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
		Route::get('/{identify}/review', [\App\Http\Controllers\Api\ShopViewsController::class, 'review'])->where(['identify' => '[a-zA-Z0-9\-_]+']);
	});
});