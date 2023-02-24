<?php

namespace MyPackages\Social;

use \Google\Client;
use Illuminate\Support\Facades\Log;

class GoogleLogin extends SocialLogin {
	protected $endpoints = [
		'redirect' => '',
		// TODO GCP側の設定とhostsの追加
		'callback' => 'http://react.practice.local.com/auth/social/google'
	];
	protected $type = 'google';
	protected $client;

	public function __construct($client_id, $secret_id)
	{
		$this->client = new Client();
		$this->client->setClientId($client_id);
		$this->client->setClientSecret($secret_id);
		$this->client->setRedirectUri($this->endpoints['callback']);
		$this->client->setScopes(['openid', 'email', 'profile']);
		$this->client->setAccessType('offline');
	}

	public function redirect($state)
	{
		$this->personal_token($state, 5);
		return $this->client->createAuthUrl();
	}

	public function verify($state, $params)
	{
		$personal_token = $this->find_personal_token($state);
		if($personal_token) {
			if((new \DateTime())->format('Y-m-d H:i:s') > $personal_token->expired_at) return false;

			$access_token = $this->client->fetchAccessTokenWithAuthCode($params['code']);
			$info = $this->client->verifyIdToken($access_token['id_token']);
			if(!$info) {
				throw new \Exception('トークンの検証に失敗しました。');
			}

			$now = new \DateTimeImmutable();
			$personal_token->fill(['used_at' => $now->format('Y-m-d H:i:s')])->save();

			return [
				'token' => $access_token['id_token'],
				'uniq' => $info['sub'],
				'email' => $info['email'],
				'name' => $info['name'],
				'expired_at' => $now->modify('+' . $access_token['expires_in'] . ' seconds')->format('Y-m-d H:i:s')
			];
		}
	}

	public function provider()
	{
		return $this->type;
	}
}