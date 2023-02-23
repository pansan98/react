<?php

namespace MyPackages\Social;

use \MyPackages\Social\GoogleLogin;

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

	public function driver($type)
	{
		switch($type) {
			case 'google':
				$this->driver = new GoogleLogin();
				break;
		}

		return $this;
	}

	public function redirect($type = 'url')
	{
		$redirect = $this->driver->getRedirect();
		if($type === 'redirect') {
			header('Location: ' . $redirect);
			exit();
		}

		return $redirect;
	}

	public function setClientId($client_id)
	{
		if(!$this->driver) {
			throw new \Exception('Driver not set.');
		}
		$this->driver->setClientId($client_id);
		return $this;
	}

	public function setSecretId($secret_id)
	{
		if(!$this->driver) {
			throw new \Exception('Driver not set.');
		}
		$this->driver->setSecretId($secret_id);
		return $this;
	}
}