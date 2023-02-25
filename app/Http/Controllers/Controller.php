<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Providers\MyAuthServiceProvider;
use App\Http\Controllers\Traits\MyJsonResponse;
use App\Http\Controllers\Traits\MyAuthorizeController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, MyJsonResponse, MyAuthorizeController;

    /** @var MyAuthServiceProvider */
	protected MyAuthServiceProvider $myauth_provider;

    public function __construct(MyAuthServiceProvider $myAuthProvider)
	{
		$this->myauth_provider = $myAuthProvider;
	}
}
