<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ShopProducts;
use App\Models\ShopPurchase;
use App\Models\ShopPurchaseHistories;
use Illuminate\Support\Facades\Log;

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
		$purchases = ShopPurchase::where('user_id', $user->id)->orderByDesc('created_at')->get();
		if($purchases) {
			foreach ($purchases as &$purchase) {
				$purchase->products = ShopProducts::with(['thumbnails'])
					->select('shop_products.*')
					->addSelect('shop_purchase_histories.price AS history_price')
					->addSelect('shop_reviews.id AS review')
					->join('shop_purchase_histories', function($join) use ($purchase) {
						$join->on('shop_purchase_histories.product_id', '=', 'shop_products.id')
							->where('shop_purchase_histories.purchase_id', '=', $purchase->id);
					})
					->leftJoin('shop_reviews', function($join) use ($user) {
						$join->on('shop_reviews.product_id', '=', 'shop_products.id')
							->where('shop_reviews.user_id', '=', $user->id);
					})
					->get();
			}
		}

		return $purchases;
	}

	public function products(\App\Models\ShopProducts $product)
	{
		return ShopPurchaseHistories::where('product_id', $product->id)
			->orderByDesc('created_at')
			->get();
	}
}
