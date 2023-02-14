<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ShopProducts;
use App\Models\ShopCarts;
use App\Models\ShopCartsProducts;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ShopCartController extends Controller
{
	public function add(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			/** @var \App\Providers\ShopCartProvider $provider */
			$provider = app(\App\Providers\ShopCartProvider::class);
			$products = $provider->add($user, $identify);
			return $this->success(['products' => $products]);
		}

		return $this->failed();
	}

	public function remove(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$provider = app(\App\Providers\ShopCartProvider::class);
			$products = $provider->remove($user, $identify);
			return $this->success(['products' => $products]);
		}
		return $this->failed();
	}

	public function cart(Request $request)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			if($cart) {
				/** @var \App\Providers\ShopCartProvider $provider */
				$provider = app(\App\Providers\ShopCartProvider::class);
				$products = $provider->products($cart);
				return $this->success(['products' => $products]);
			}
		}
		return $this->failed();
	}

	public function pay(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$cart = ShopCarts::where('user_id', $user->id)
				->first();
			if($cart) {
				/** @var \App\Providers\ShopCartProvider $provider */
				$provider = app(\App\Providers\ShopCartProvider::class);
				$ret = $provider->pay($user, $cart);
				if($ret) {
					return $this->success();
				}
			}
		}
		return $this->failed();
	}
}
