<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\ShopProductRequest;
use App\Models\ShopProducts;
use Illuminate\Support\Facades\DB;

class ShopProductController extends Controller
{
	public function products(Request $request)
	{
		$user = $this->myauth_provider->get();
		$search = $request->query->get('search', '');
		if(!empty($user)) {
			$products = ShopProducts::where('user_id', $user->id)
				->where('deleted_at', null)
				->where(function($query) use ($search) {
					if(!empty($search)) {
						$query->where('name', 'LIKE', '%'.$search.'%');
					}
				})
				->orderByDesc('id')
				->get()
				->toArray();
			return $this->success(['products' => $products]);
		}

		return $this->failed();
	}

	public function product(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$product = ShopProducts::where('user_id', $user->id)
				->where('identify_code', $identify)
				->where('deleted_at', null)
				->first();
			if($product) {
				return $this->success([
					'product' => $product
				]);
			}
		}
		return $this->failed();
	}

	public function create(ShopProductRequest $request)
	{
		$params = $request->request->all();
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$ret = DB::transaction(function() use ($params, $user) {
				$params['user_id'] = $user->id;
				$product = new ShopProducts();
				if(empty($params['identify_code'])) {
					$params['identify_code'] = ShopProducts::identify_code();
				}
				if(!empty($params['thumbnails'])) {
					/** @var \App\Providers\MediaServiceProvider $media_service */
					$media_service = app(\App\Providers\MediaServiceProvider::class);
					$media_group = $media_service->save($params['thumbnails']);
					if($media_group) {
						$params['media_group_id'] = $media_group->id;
					}
				}
				$product->fill($params)->save();
				return true;
			}); 
			if($ret) {
				return $this->success();
			}
		}

		return $this->failed();
	}

	public function edit(ShopProductRequest $request, $identify)
	{
		$params = $request->request->all();
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$ret = DB::transaction(function() use ($params, $user, $identify) {
				$product = ShopProducts::where('user_id', $user->id)
					->where('identify_code', $identify)
					->where('deleted_at', null)
					->first();
				if($product) {
					// TODO MediaGroup内の差分処理
					$product->fill($params)->save();
				}
				return true;
			});
			if($ret) {
				return $this->success();
			}
		}
		return $this->failed();
	}

	public function destroy(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$ret = DB::transaction(function() use ($user, $identify) {
				$product = ShopProducts::where('user_id', $user->id)
					->where('identify_code', $identify)
					->where('deleted_at', null)
					->first();
				if(!empty($product)) {
					$product->delete();
				}
				return true;
			});
			return $this->success();
		}

		return $this->failed();
	}
}
