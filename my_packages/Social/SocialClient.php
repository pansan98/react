<?php

namespace MyPackages\Social;

use \MyPackages\Social\GoogleLogin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use \App\Models\MyUser;
use \App\Models\SharingLogin;
use \App\Models\SocialTokens;

class SocialClient {
	public static $instance;

	protected $driver;

	public static function get()
	{
		if(!self::$instance instanceof SocialClient) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function driver($provider, $client_id, $secret_id)
	{
		switch($provider) {
			case 'google':
				$this->driver = new GoogleLogin($client_id, $secret_id);
				break;
		}

		return $this;
	}

	public function verify(\Illuminate\Http\Request $request, $params)
	{
		$model = null;
		$info = $this->driver->verify($request->session()->pull('state'), $params);
		if($info) {
			$user = MyUser::where('social_uniq', $info['uniq'])
				->first();
			if(!$user) {
				try {
					$model = DB::transaction(function() use ($request, $info) {
						// 同じemailアドレスが存在しなければ作る
						$r_user = new MyUser();
						$r_user->fill([
							'name' => $info['name'],
							'email' => $info['email'],
							'identify_code' => MyUser::identify_code(),
							'social_uniq' => $info['uniq']
						])->save();

						$ip = $request->ip();
						$os = $request->header('User-Agent');
						$sharing = new SharingLogin();
						$sharing->fill([
							'user_id' => $r_user->id,
							'ip' => $ip,
							'os' => $os
						])->save();

						$social_token = new SocialTokens();
						$social_token->fill([
							'user_id' => $r_user->id,
							'provider' => $this->driver->provider(),
							'token' => $info['token'],
							'expired_at' => $info['expired_at']
						])->save();

						$myauth_provider = app(\App\Providers\MyAuthServiceProvider::class);
						$myauth_provider->retension($r_user->identify_code, $sharing);
						return $r_user;
					});
				} catch(\Exception $e) {
					DB::rollBack();
					Log::warning($e->getMessage());
				}
			} else {
				$social_token = SocialTokens::where('user_id', $user->id)
					->first();
				if($social_token) {
					$sharing = SharingLogin::where('user_id', $user->id)
						->where('ip', $request->ip())
						->where('os', $request->header('User-Agent'))
						->first();
					if(!$sharing) {
						$sharings = SharingLogin::where('user_id', $user->id)->get()->toArray();
						if(count($sharings) < SharingLogin::MAX_USE) {
							$sharing = new SharingLogin();
							$sharing->fill([
								'user_id' => $user->id,
								'ip' => $request->ip(),
								'os' => $request->header('User-Agent')
							])->save();
						}
					}

					if($sharing) {
						$myauth_provider = app(\App\Providers\MyAuthServiceProvider::class);
						$myauth_provider->retension($user->identify_code, $sharing);
						$model = $user;
					}
				}
			}
		}

		return $model;
	}

	public function redirect($state, $type = 'url')
	{
		$redirect = $this->driver->redirect($state);
		if($type === 'redirect') {
			header('Location: ' . $redirect);
			exit();
		}

		return $redirect;
	}
}