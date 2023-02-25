<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\MyAuthController;
use App\Models\SharingLogin;
use App\Models\MyUser;
use Illuminate\Support\Facades\DB;

class MySharingController extends MyAuthController
{
	public function use(Request $request)
	{
		$params = $request->request->all();
		$user = MyUser::where('login_id', $params['login_id'])
			->where('delete_flag', 0)
			->first();
		if(!empty($user)) {
			if(password_verify($params['password'], $user->password)) {
				list($ret, $sharing) = DB::transaction(function() use ($params, $user) {
					$sharing = new SharingLogin();
					$sharing->fill(array_merge($params, [
						'user_id' => $user->id
					]))->save();
					return [true, $sharing];
				});
				if($ret) {
					if($user->two_authorize_flag) {
						list($token, $code) = $this->twoAuthorize($user, $user->id, ($user->access_token) ? $user->access_token->token : null);
						$redirect = '/auth/authorize/' . $user->identify_code . '/' . $token;
						$res = [
							'result' => true,
							'share' => false,
							'authorize' => true,
							'redirect' => $redirect
						];
						return $this->success($res);
					} else {
						$this->myauth_provider->retension($user->identify_code, $sharing);
						return $this->success();
					}
				}
			}
		}
		return $this->failed();
	}

	public function approval(Request $request)
	{
		
	}
}
