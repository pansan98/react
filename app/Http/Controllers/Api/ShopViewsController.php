<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ShopProducts;

class ShopViewsController extends Controller
{
	public function history(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$product = ShopProducts::where('user_id', $user->id)
				->where('identify_code', $identify)
				->where('deleted_at', null)
				->first();
			if($product) {
				/** @var \App\Providers\ShopHistoryProvider $provider */
				$provider = app(\App\Providers\ShopHistoryProvider::class);
				$histories = $provider->products($product);
				return $this->success(['views' => $histories, 'product' => $product]);
			}
		}

		return $this->failed();
	}

	public function review(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$product = ShopProducts::where('user_id', $user->id)
				->where('identify_code', $identify)
				->where('deleted_at', null)
				->first();
			if($product) {
				/** \App\Providers\ShopViewsProvider $provider */
				$provider = app(\App\Providers\ShopViewsProvider::class);
				$reviews = $provider->review($product);
				return $this->success(['views' => $reviews]);
			}
		}

		return $this->failed();
	}
}
