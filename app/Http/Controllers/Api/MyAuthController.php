<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthProfileRequest;
use App\Http\Requests\AuthForgotRequest;
use App\Http\Controllers\Controller;
use App\Models\MyUser;
use App\Models\SharingLogin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MyAuthController extends Controller
{
	public function login(AuthLoginRequest $request)
	{
		$res = [
			'result' => false,
			'share' => false
		];
		$params = $request->request->all();
		$user = MyUser::with(['access_token'])->where('login_id', $params['login_id'])
			->where('delete_flag', 0)
			->first();
		if(!empty($user)) {
			if(password_verify($params['password'], $user->password)) {
				$ip = $request->ip();
				$os = $request->header('User-Agent');
				$sharing = SharingLogin::where('ip', $ip)
					->where('os', $os)
					->where('user_id', $user->id)
					->first();
				if(!empty($sharing)) {
					if($user->two_authorize_flag) {
						list($token, $code) = $this->myAuthorize($user, $user->id, 60 * 10);
						$redirect = '/auth/authorize/' . $user->identify_code . '/' . $token;
						$res = [
							'result' => true,
							'share' => false,
							'authorize' => true,
							'redirect' => $redirect
						];
					} else {
						$this->myauth_provider->retension($user->identify_code, $sharing);
						return $this->success();
					}
				} else {
					$sharings = SharingLogin::where('user_id', $user->id)->get()->toArray();
					if(count($sharings) < SharingLogin::MAX_USE) {
						$res = [
							'result' => true,
							'share' => true,
							'authorize' => false,
							'sharings' => [
								'sharing' => true,
								'sharing_available' => true,
								'ip' => $ip,
								'os' => $os,
								'use' => count($sharings)
							]
						];
					} else {
						$res = [
							'result' => true,
							'share' => true,
							'sharings' => [
								'sharing' => true,
								'sharing_available' => false,
								'use' => count($sharings)
							]
						];
					}
				}
			}
		}

		return response()->json($res);
	}

	public function logout(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$user->fill(['active_flag' => 0, 'active_sharing_id' => null])->save();
		}
		$request->session()->remove('identify');
		return $this->success();
	}

	public function register(AuthRegisterRequest $request)
	{
		$params = $request->request->all();
		$params['password'] = password_hash($params['password'], PASSWORD_DEFAULT);
		$params['identify_code'] = MyUser::identify_code();
		$res = ['result' => false];
		$res['result'] = DB::transaction(function() use ($params, $request) {
			$my_user = new MyUser();
			$my_user->fill($params)->save();

			$ip = $request->ip();
			$os = $request->header('User-Agent');
			$sharing = new SharingLogin();
			$sharing->fill([
				'user_id' => $my_user->id,
				'ip' => $ip,
				'os' => $os
			])->save();

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
				'gender' => $user->gender,
				'thumbnail' => $user->thumbnail,
				'two_authorize_flag' => $user->two_authorize_flag
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
				$ret = [];
				if(!empty($params['thumbnail'])) {
					$thumbnail = isset($params['thumbnail'][0]) ? $params['thumbnail'][0] : null;
					if(!empty($thumbnail)) {
						/** @var \App\Providers\MediaServiceProvider $mediaService */
						$mediaService = app(\App\Providers\MediaServiceProvider::class);
						$mediaService->add_path($user->identify_code);
						$media = $mediaService->save($thumbnail);
						if(!empty($media)) {
							$params['thumbnail_id'] = $media->id;
							$ret['path'] = $media->path;
						}
					}
				}

				if(!empty($params['two_authorize'])) {
					$params['two_authorize_flag'] = true;
				} else {
					$params['two_authorize_flag'] = false;
				}

				$user->fill($params)->save();
				if(empty($ret['path'])) {
					$ret['path'] = ($user->thumbnail) ? $user->thumbnail->path : null;
				}
				return $ret;
			});
			return $this->success($result);
		}

		return $this->failed();
	}

	public function thumbnail_destroy(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user->thumbnail) {
			/** @var \App\Providers\MediaServiceProvider $mediaService */
			$mediaService = app(\App\Providers\MediaServiceProvider::class);
			$mediaService->destroy($user->thumbnail->id);
		}

		return $this->success();
	}

	public function certification(Request $request, $identify, $token)
	{
		$user = MyUser::where('identify_code', $identify)
			->first();
		if($user) {
			$ip = $request->ip();
			$os = $request->header('User-Agent');
			$sharing = SharingLogin::where('ip', $ip)
				->where('os', $os)
				->where('user_id', $user->id)
				->first();
			if($sharing) {
				$code = $request->request->get('code');
				$ret = $this->collation($user, $user->id, $token, $code);
				if($ret) {
					$this->myauth_provider->retension($user->identify_code, $sharing);
					return $this->success(['authorize' => true]);
				}
			}
			return $this->success(['authorize' => false]);
		}

		return $this->failed();
	}

	public function forgot(AuthForgotRequest $request)
	{
		$forgot = $request->request->get('forgot');
		$user = MyUser::where(function($query) use ($forgot) {
			$query->orWhere('login_id', $forgot)
				->orWhere('email', $forgot);
		})->where('delete_flag', 0)
			->first();
		if($user) {
			list($token, $code) = $this->myAuthorize($user, $user->id);
			return $this->success([
				'identify' => $user->identify_code,
				'token' => $token
			]);
		}

		return $this->failed();
	}
}
