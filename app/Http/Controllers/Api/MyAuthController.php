<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthProfileRequest;
use App\Http\Controllers\Controller;
use App\Models\MyUser;
use Illuminate\Support\Facades\DB;
use Throwable;
use Illuminate\Support\Facades\Log;

class MyAuthController extends Controller
{
	public function login(AuthLoginRequest $request)
	{
		$res = [
			'result' => false
		];
		$params = $request->request->all();
		$user = MyUser::where('login_id', $params['login_id'])
			->where('delete_flag', 0)
			->first();
		if(!empty($user)) {
			if(password_verify($params['password'], $user->password)) {
				$request->session()->put('identify', $user->identify_code);
				$res['result'] = true;
			}
		}

		return response()->json($res);
	}

	public function register(AuthRegisterRequest $request)
	{
		$params = $request->request->all();
		$params['password'] = password_hash($params['password'], PASSWORD_DEFAULT);
		$params['identify_code'] = MyUser::identify_code();
		$res = ['result' => false];
		$res['result'] = DB::transaction(function() use ($params) {
			$my_user = new MyUser();
			$my_user->fill($params)->save();
			return true;
		});

		return response()->json($res);
	}

	public function user(Request $request)
	{
		$data = ['result' => false];
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$data['result'] = true;
			$data['user'] = [
				'name' => $user->name,
				'email' => $user->email,
				'profession' => $user->profession,
				'gender' => $user->gender
			];
		}

		return response()->json($data);
	}

	public function labels(Request $request)
	{
		$label = $request->query->get('label');
		$labels = MyUser::labels($label);
		return $this->success(['labels' => $labels]);
	}

	public function profile(AuthProfileRequest $request)
	{
		$params = $request->request->all();
		$user = $this->myauth_provider->get();
		if(!empty($user)) {
			$result = DB::transaction(function() use ($user, $params) {
				$user->fill($params)->save();
				return true;
			});
			return $this->success();
		}

		return $this->failed();
	}
}
