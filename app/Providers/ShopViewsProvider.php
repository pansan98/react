<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\ShopReviews;

class ShopViewsProvider extends ServiceProvider
{
	/**
	 * Register services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(ShopViewsProvider::class, function($app) {
			return new ShopViewsProvider($app);
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

	public function review(\App\Models\ShopProducts $product)
	{
		$reviews = [
			'total' => ShopReviews::where('product_id', $product->id)->count(),
			'reviews' => ShopReviews::with(['user'])->where('product_id', $product->id)->orderByDesc('created_at')->get(),
			'stars' => []
		];
		if($reviews['total'] > 0) {
			foreach(ShopReviews::STARTS as $star) {
				$reviews['stars'][$star] = [];
				$count = ShopReviews::where('product_id', $product->id)->where('star', $star)->count();
				$reviews['stars'][$star]['count'] = $count;
				$reviews['stars'][$star]['star'] = $star;
				if($count > 0) {
					$reviews['stars'][$star]['radio'] = ($reviews['total'] / ($count * 100));
				} else {
					$reviews['stars'][$star]['radio'] = 0;
				}
			}
		}
		return $reviews;
	}

	/**
	 *
	 * @param \App\Models\ShopProducts $product
	 * @param [type] $id
	 * @return ShopReviews|mixed
	 */
	public function viewReview(\App\Models\ShopProducts $product, $id)
	{
		$review = ShopReviews::where('product_id', $product->id)
			->where('id', $id)
			->first();
		if($review) {
			ShopReviews::viewed($review);
		}
		return $review;
	}
}
