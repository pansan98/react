<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\ShopFavorites;
use App\Models\ShopProducts;

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
}
