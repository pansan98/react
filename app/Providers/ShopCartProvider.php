<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use App\Models\ShopProducts;
use App\Models\ShopCarts;
use App\Models\ShopCartsProducts;

class ShopCartProvider extends ServiceProvider
{
	/**
	 * Register services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(ShopCartProvider::class, function($app) {
			return new ShopCartProvider($app);
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

	public function add(\App\Models\MyUser $user, $identify)
	{
		$products = [];
		$product = ShopProducts::where('identify_code', $identify)
			->where('deleted_at', null)
			->first();
		if($product) {
			/** @var ShopCarts $cart */
			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			if(!$cart) {
				$cart = DB::transaction(function() use ($user) {
					$cart = new ShopCarts();
					$cart->fill(['user_id' => $user->id])->save();
					return $cart;
				});
			}

			$ret = DB::transaction(function() use ($cart, $product) {
				// relation table
				$cart_product = new ShopCartsProducts();
				$cart_product->fill(['cart_id' => $cart->id, 'product_id' => $product->id])->save();
				return true;
			});

			// 更新後のカート商品を取得
			$products = $this->product_identifies($cart);
		}

		return $products;
	}

	public function remove(\App\Models\MyUser $user, $identify)
	{
		$products = [];
		$product = ShopProducts::where('identify_code', $identify)
			->where('deleted_at', null)
			->first();
		if($product) {
			/** @var ShopCarts $cart */
			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			if($cart) {
				$ret = DB::transaction(function() use ($cart, $product) {
					$cart_product = ShopCartsProducts::where('cart_id', $cart->id)
						->where('product_id', $product->id)
						->first();
					if($cart_product) {
						$cart_product->delete();
					}
					return true;
				});

				// 更新後のカート商品を取得
				$products = $this->product_identifies($cart);
			}
		}

		return $products;
	}

	public function product_identifies(ShopCarts $cart)
	{
		$carts = [];
		$products = ShopProducts::select('identify_code')
			->join('shop_carts_products', function($join) use ($cart) {
				$join->on('shop_products.id', '=', 'shop_carts_products.product_id')
					->where('shop_carts_products.cart_id', '=', $cart->id);
			})
			->distinct()
			->get();
		
		foreach ($products as $product) {
			$carts[] = $product->identify_code;
		}
		return $carts;
	}
}
