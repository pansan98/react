<?php

namespace MyPackages\Social;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\ClientInterface as GuzzleClientInterface;

abstract class SocialLogin {
	protected $guzzle;
	protected $endpoints = [
		'redirect' => '',
		'callback' => ''
	];
	protected $type;
	protected $client_id;
	protected $secret_id;

	public function __construct()
	{
		$this->guzzle = new GuzzleClient();
	}

	public function setClientId($client_id)
	{
		$this->client_id = $client_id;
		return $this;
	}

	public function setSecretId($secret_id)
	{
		$this->secret_id = $secret_id;
		return $this;
	}

	public function getRedirect()
	{
		$endpoint = str_replace('{client}', $this->client_id, $this->endpoints['redirect']);
		$endpoint = str_replace('{callback}', $this->endpoints['callback'], $endpoint);
		return $endpoint;
	}

	public function post($url, $options = [])
	{
		$response = $this->guzzle->request('POST', $url, $options);
		return $response->getBody();
	}
}