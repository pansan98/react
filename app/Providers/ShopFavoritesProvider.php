<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class ShopFavoritesProvider extends ServiceProvider
{
	/**
	 * Register services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(ShopFavoritesProvider::class, function($app) {
			return new ShopFavoritesProvider($app);
		});
		//
	}

	/**
	 * Bootstrap services.
	 *
	 * @return void
	 */
	public function boot()
	{
		//
	}

	public function favorites(\App\Models\MyUser $user)
	{
		/** @var \App\Models\MyUser $user */
		$products = \App\Models\ShopProducts::select('identify_code')
			->join('shop_favorites', function($join) use ($user) {
				$join->on('shop_products.id', '=', 'shop_favorites.product_id')
					->where('shop_favorites.user_id', '=', $user->id);
			})
			->distinct()
			->get();

		$favorites = [];
		if($products) {
			foreach ($products as $product) {
				$favorites[] = $product->identify_code;
			}
		}

		return $favorites;
	}

	public function products(\App\Models\MyUser $user)
	{
		$products = \App\Models\ShopProducts::with(['user', 'thumbnails'])
			->join('shop_favorites', function($join) use ($user) {
				$join->on('shop_products.id', '=', 'shop_favorites.product_id')
					->where('shop_favorites.user_id', '=', $user->id);
			})->where('deleted_at', null)
			->distinct()
			->get()
			->toArray();

		return $products;
	}
}
