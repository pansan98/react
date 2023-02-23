<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use MyPackages\Social\SocialClient;

class SocialAuthController extends Controller
{
	public function redirect(Request $request, $type)
	{
		$client = SocialClient::get();
		$redirect = $client->driver($type)->redirect();
		return $this->success(['redirect' => $redirect]);
	}
}
