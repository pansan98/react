<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ShopProducts;
use App\Models\ShopCarts;

class ShopEcProductController extends Controller
{
	public function products(Request $request)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$search = $request->query->get('search', '');
			$products = ShopProducts::with(['user', 'thumbnails'])
				->where('user_id', '!=', $user->id)
				->where('inventoly', '>', 0)
				->where('deleted_at', null)
				->where(function($query) use ($search) {
					if(!empty($search)) {
						$searches = explode(' ', mb_convert_kana($search, 's', 'UTF-8'));
						foreach ($searches as $value) {
							$query->orWhere('name', 'LIKE', '%'.$value.'%');
						}
					}
				})
				->orderByDesc('id')
				->get()
				->toArray();
			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			$identifies = [];
			if($cart) {
				/** @var \App\Providers\ShopCartProvider $provider */
				$provider = app(\App\Providers\ShopCartProvider::class);
				$identifies = $provider->product_identifies($cart);
			}

			/** @var \App\Providers\ShopFavoritesProvider $f_provider */
			$f_provider = app(\App\Providers\ShopFavoritesProvider::class);
			$favorites = $f_provider->favorites($user);

			return $this->success([
				'products' => $products,
				'cart' => ['products' => $identifies],
				'favorites' => $favorites
			]);
		}

		return $this->failed();
	}

	public function product(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$product = ShopProducts::with(['user', 'thumbnails'])
				->where('identify_code', $identify)
				->where('deleted_at', null)
				->first()
				->toArray();
			if($product) {
				$cart = ShopCarts::where('user_id', $user->id)->first();
				$carts = [];
				if($cart) {
					/** @var \App\Providers\ShopCartProvider $cart_provider */
					$cart_provider = app(\App\Providers\ShopCartProvider::class);
					$carts = $cart_provider->product_identifies($cart);
				}

				/** @var \App\Providers\ShopFavoritesProvider $favorite_provider */
				$favorite_provider = app(\App\Providers\ShopFavoritesProvider::class);
				$favorites = $favorite_provider->favorites($user);

				return $this->success([
					'product' => $product,
					'cart' => ['products' => $carts],
					'favorites' => $favorites
				]);
			}
		}

		return $this->failed();
	}
}
