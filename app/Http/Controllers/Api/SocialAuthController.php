<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use MyPackages\Social\SocialClient;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Models\SocialTokens;
use App\Models\MyUser;
use App\Models\SharingLogin;
use Illuminate\Support\Facades\DB;

class SocialAuthController extends Controller
{
	public function redirect(Request $request, $provider)
	{
		if(!in_array($provider, ['google', 'twitter', 'apple', 'github'])) return $this->failed();

		$state = MyUser::identify_code(20);
		$request->session()->put('state', $state);
		
		$client = SocialClient::get();
		$redirect = $client->driver(
			$provider, config('services.social.'.$provider.'.client'),
			config('services.social.'.$provider.'.secret')
		)->redirect($state);
		return $this->success(['redirect' => $redirect]);
	}

	public function receive(Request $request, $provider)
	{
		if(!in_array($provider, ['google', 'twitter', 'apple', 'github'])) return redirect()->to('/auth/login');

		$params = $request->query->all();
		if(!$params['code']) return throw new NotFoundHttpException('不正なアクセスです。');

		$client = SocialClient::get();
		$client->driver($provider, config('services.social.' . $provider . '.client'), config('services.social.' . $provider . '.secret'));
		$user = $client->verify($request, $params);
		if($user) {
			return redirect()->to('/');
		}

		return redirect()->to('/auth/login');
	}
}
