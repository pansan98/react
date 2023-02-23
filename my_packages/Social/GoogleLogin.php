<?php

namespace MyPackages\Social;

class GoogleLogin extends SocialLogin {
	protected $endpoints = [
		'redirect' => 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={client_id}&redirect_uri={callback}&scope=name,email>&access_type=offline&approval_prompt=force',
		// TODO GCP側の設定とhostsの追加
		'callback' => 'http://react.practice.local.com/auth/social/google'
	];
	protected $type = 'google';
}