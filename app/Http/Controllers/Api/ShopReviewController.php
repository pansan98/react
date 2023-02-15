<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\ShopReviewRequest;
use App\Http\Controllers\Controller;
use App\Models\ShopReviews;
use App\Models\ShopProducts;
use Illuminate\Support\Facades\DB;

class ShopReviewController extends Controller
{
	public function create(ShopReviewRequest $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$product = ShopProducts::where('identify_code', $identify)
				->first();
			if($product) {
				// すでにレビュー済みでないか確認する
				$review = ShopReviews::where('user_id', $user->id)
					->where('product_id', $product->id)
					->first();
				if(!$review) {
					$params = $request->request->all();
					$params['user_id'] = $user->id;
					$params['product_id'] = $product->id;
					$ret = DB::transaction(function() use ($params) {
						$review = new ShopReviews();
						$review->fill($params)->save();
						return true;
					});

					if($ret) {
						return $this->success();
					}
				}
			}
		}
		return $this->failed();
	}

	public function product(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$product = ShopProducts::with(['thumbnails'])
				->where('user_id', '!=', $user->id)
				->where('identify_code', $identify)
				->first();
			if($product) {
				return $this->success([
					'product' => $product
				]);
			}
		}
		return $this->failed();
	}
}
