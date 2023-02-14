<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ShopProducts;
use App\Models\ShopPurchase;
use App\Models\ShopPurchaseHistories;

class ShopHistoryProvider extends ServiceProvider
{
	/**
	 * Register services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(ShopHistoryProvider::class, function($app) {
			return new ShopHistoryProvider($app);
		});
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

	public function histories(\App\Models\MyUser $user)
	{
		$purchases = ShopPurchase::where('user_id', $user->id)->get();
		if($purchases) {
			foreach ($purchases as &$purchase) {
				$purchase->products = ShopProducts::with(['thumbnails'])
					->join('shop_purchase_histories', function($join) use ($purchase) {
						$join->on('shop_purchase_histories.product_id', '=', 'shop_products.id')
							->where('shop_purchase_histories.purchase_id', '=', $purchase->id);
					})
					->get();
			}
		}

		return $purchases;
	}
}
