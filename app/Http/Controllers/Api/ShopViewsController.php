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
				->where('identify', $identify)
				->where('deleted_at', null)
				->first();
		}
	}

	public function review(Request $request, $identify)
	{

	}
}
