<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\ShopFavorites;
use App\Models\ShopProducts;
use App\Models\ShopCarts;
use App\Models\Folders;

class ShopFavoritesController extends Controller
{
	public function add(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$product = ShopProducts::where('identify_code', $identify)
				->where('deleted_at', null)
				->first();
			if($product)  {
				$my_favorite = ShopFavorites::where('user_id', $user->id)
					->where('product_id', $product->id)
					->first();
				if(!$my_favorite) {
					$favorite = new ShopFavorites();
					$favorite->fill(['user_id' => $user->id, 'product_id' => $product->id])->save();
					/** @var \App\Providers\ShopFavoritesProvider $provider */
					$provider = app(\App\Providers\ShopFavoritesProvider::class);
					$favorites = $provider->favorites($user);
					return $this->success(['favorites' => $favorites]);
				}
			}
		}

		return $this->failed();
	}

	public function remove(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$product = ShopProducts::where('identify_code', $identify)
				->where('deleted_at', null)
				->first();
			if($product) {
				$favorite = ShopFavorites::where('user_id', $user->id)
					->where('product_id', $product->id)
					->first();
				if($favorite) {
					$ret = DB::transaction(function() use ($favorite) {
						$favorite->delete();
						return true;
					});
					if($ret) {
						/** @var \App\Providers\ShopFavoritesProvider $provider */
						$provider = app(\App\Providers\ShopFavoritesProvider::class);
						$favorites = $provider->favorites($user);
						return $this->success(['favorites' => $favorites]);
					}
				}
			}
		}
		
		return $this->failed();
	}

	public function favorites(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			/** @var \App\Providers\ShopFavoritesProvider $provider */
			$provider = app(\App\Providers\ShopFavoritesProvider::class);
			$products = $provider->products($user);
			$favorites = $provider->favorites($user);

			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			$carts = [];
			if($cart) {
				/** @var \App\Providers\ShopCartProvider $cart_provider */
				$cart_provider = app(\App\Providers\ShopCartProvider::class);
				$carts = $cart_provider->product_identifies($cart);
			}

			return $this->success([
				'products' => $products,
				'carts' => $carts,
				'favorites' => $favorites
			]);
		}

		return $this->failed();
	}

	public function folders(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			return $this->success(['data' => []]);
		}
		return $this->failed();
	}

	public function folder(Request $request, $folder_id)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$product = $request->request->get('product');
		}
	}

	public function create_folder(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'name' => ['required']
		]);
		if($validator->fails()) {
			return $this->failed([
				'errors' => $validator->errors()
			]);
		}

		$user = $this->myauth_provider->get();
	}
}
