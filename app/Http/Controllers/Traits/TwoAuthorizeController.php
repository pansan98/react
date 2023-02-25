<?php

namespace App\Http\Controllers\Traits;

use App\Models\AccessTokens;
use Illuminate\Support\Facades\Crypt;

trait TwoAuthorizeController
{
	protected function twoAuthorize($class, $id, $token, $expire = 3600, $callback_fn = null)
	{
		$access_token = null;
		if($token) {
			$token = Crypt::encryptString($token);
			$access_token = AccessTokens::findAccessToken($class, $id, $token);
		}

		if(!$access_token) {
			list($token, $code) = AccessTokens::saveAccessToken($class, $id, $expire);
		} else {
			list($token, $code) = AccessTokens::refreshAccessToken($class, $id, $expire);
		}

		if($callback_fn) {
			$callback_fn($code);
		}
		return [$token, $code];
	}

	protected function collation($class, $id, $token, $code)
	{
		$access_token = AccessTokens::findActiveAccessToken($class, $id, $token);
		if($access_token) {
			if($access_token->authorize_code === $code) {
				return AccessTokens::used($access_token);
			}
		}

		return false;
	}
}
