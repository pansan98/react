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
			$folder = $request->query->get('folder', null);
			/** @var \App\Providers\ShopFavoritesProvider $provider */
			$provider = app(\App\Providers\ShopFavoritesProvider::class);
			$products = $provider->products($user, $folder);
			$favorites = $provider->favorites($user);

			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			$carts = [];
			if($cart) {
				/** @var \App\Providers\ShopCartProvider $cart_provider */
				$cart_provider = app(\App\Providers\ShopCartProvider::class);
				$carts = $cart_provider->product_identifies($cart);
			}
			$folders = Folders::findFolders($user, $user->id, 'favorite', $folder)->toArray();

			return $this->success([
				'products' => $products,
				'carts' => $carts,
				'favorites' => $favorites,
				'folders' => $folders
			]);
		}

		return $this->failed();
	}

	public function folders(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$folders = Folders::treeFolders($user, $user->id, 'favorite');
			return $this->success(['folders' => $folders]);
		}
		return $this->failed();
	}

	public function folder(Request $request, $folder_id)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$code = $request->request->get('product');
			$product = ShopProducts::where('identify_code', $code)
				->whereNull('deleted_at')
				->first();
			if($product) {
				$favorite = ShopFavorites::where('user_id', $user->id)
					->where('product_id', $product->id)
					->first();
				if($favorite) {
					$ret = DB::transaction(function() use ($favorite, $folder_id) {
						$favorite->fill(['folder_id' => intval($folder_id)])->save();
						return true;
					});
					return $this->success();
				}
			}
		}
		return $this->failed();
	}

	public function folder_create(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'f_name' => ['required']
		]);
		if($validator->fails()) {
			return $this->failed([
				'errors' => $validator->errors()
			]);
		}

		$user = $this->myauth_provider->get();
		if($user) {
			$name = $request->request->get('f_name');
			$parent = $request->request->get('parent', null);
			$ret = Folders::create($user, $user->id, 'favorite', $name, $parent);
			if($ret) {
				return $this->success();
			}
		}

		return $this->failed();
	}

	public function folder_back(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$id = $request->query->get('folder');
			$folder = Folders::findFolder($id, $user, $user->id, 'favorite');
			if($folder) {
				return $this->success(['parent_id' => $folder->parent_id]);
			}
		}
		return $this->failed();
	}
}
