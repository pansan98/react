<?php

namespace MyPackages\Social;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\ClientInterface as GuzzleClientInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\SocialTokens;

abstract class SocialLogin {
	protected $guzzle;
	protected $endpoints = [
		'redirect' => '',
		'callback' => ''
	];
	protected $type;
	protected $client_id;
	protected $secret_id;

	public function __construct($client_id, $secret_id)
	{
		$this->guzzle = new GuzzleClient();
		$this->client_id = $client_id;
		$this->secret_id = $secret_id;
	}

	public function post($url, $options = [])
	{
		$response = $this->guzzle->request('POST', $url, $options);
		return $response->getBody();
	}

	protected function personal_token($token, $expire = 30)
	{
		$model = null;
		try {
			$model = DB::transaction(function() use ($token, $expire) {
				$personal_token = new \App\Models\PersonalTokens();
				$personal_token->fill([
					'name' => $this->type,
					'token' => md5($token),
					'expired_at' => (new \DateTime())->modify('+'.$expire.' minutes')->format('Y-m-d H:i:s')
				])->save();
				return $personal_token;
			});
		} catch(\Exception $e) {
			DB::rollBack();
			Log::warning($e->getMessage());
		}

		return $model;
	}

	protected function find_personal_token($token)
	{
		return \App\Models\PersonalTokens::findToken(md5($token));
	}

	protected function social_token($token, \App\Models\MyUser $user, $expire)
	{
		$model = null;
		try {
			$model = DB::transaction(function() use ($token, $user, $expire) {
				$social_token = new SocialTokens();
				$social_token->fill([
					'user_id' => $user->id,
					'provider' => $this->type,
					'token' => $token,
					'expired_at' => $expire
				])->save();
				return $social_token;
			});
		} catch(\Exception $e) {
			DB::rollBack();
		}

		return $model;
	}
}