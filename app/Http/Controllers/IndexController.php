<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Providers\MyAuthServiceProvider;

class IndexController extends Controller
{
	/** @var MyAuthServiceProvider */
	protected MyAuthServiceProvider $myauth_provider;

	public function __construct(MyAuthServiceProvider $myAuthProvider)
	{
		$this->myauth_provider = $myAuthProvider;
	}

	public function index(Request $request)
	{
		if(!$this->myauth_provider->auth()) {
			return redirect()->to('/auth/login');
		}

		return view('app');
	}
}
