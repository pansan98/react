<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ShopFavoritesController extends Controller
{
	public function add(Request $request, $identify)
	{
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			
		}
	}
}
