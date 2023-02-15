<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use App\Models\ShopProducts;
use App\Models\ShopCarts;
use App\Models\ShopCartsProducts;
use App\Models\ShopPurchaseHistories;
use App\Models\ShopPurchase;
use Illuminate\Support\Facades\Log;

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
			->where('deleted_at', null)
			->distinct()
			->get();
		
		foreach ($products as $product) {
			$carts[] = $product->identify_code;
		}
		return $carts;
	}

	public function products(ShopCarts $cart, $to_array = true)
	{
		$products = ShopProducts::with(['thumbnails'])
			->select('shop_products.*')
			->join('shop_carts_products', function($join) use ($cart) {
				$join->on('shop_products.id', '=', 'shop_carts_products.product_id')
					->where('shop_carts_products.cart_id', '=', $cart->id);
			})->where('deleted_at', null)
			->distinct()
			->get();
		if($to_array) {
			$products = $products->toArray();
		}

		return $products;
	}

	public function pay(\App\Models\MyUser $user, ShopCarts $cart)
	{
		$ret = false;
		$products = $this->products($cart, false);
		if($products->count() > 0) {
			try {
				$ret = DB::transaction(function() use ($user, $products) {
					$purchase = new ShopPurchase();
					$purchase->fill(['user_id' => $user->id])->save();
					foreach ($products as $product) {
						$history = new ShopPurchaseHistories();
						$history->fill([
							'purchase_id' => $purchase->id,
							'product_id' => $product->id,
							'price' => $product->price
						])->save();
						$this->remove($user, $product->identify_code);
						$product->fill(['inventoly' => ($product->inventoly - 1)])->save();
					}
					return true;
				});
			} catch(\Exception $e) {
				Log::warning($e->getMessage());
			}
		}

		return $ret;
	}
}
