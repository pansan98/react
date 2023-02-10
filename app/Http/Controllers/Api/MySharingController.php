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
				$ret = DB::transaction(function() use ($params, $user) {
					$sharing = new SharingLogin();
					$sharing->fill(array_merge($params, [
						'user_id' => $user->id
					]))->save();
					return true;
				});
				if($ret) {
					$this->myauth_provider->retension($user->identify_code);
					return $this->success();
				}
			}
		}
		return $this->failed();
	}
}
