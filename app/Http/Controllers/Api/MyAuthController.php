<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Controllers\Controller;
use App\Providers\MyAuthServiceProvider;

class MyAuthController extends Controller
{
    /** @var MyAuthServiceProvider */
    protected $myauth_provider;
    
    public function __construct(MyAuthServiceProvider $myauth_provider)
    {
        $this->myauth_provider = $myauth_provider;
    }

    public function login(Request $request)
    {

    }

    public function register(AuthRegisterRequest $request)
    {
        $params = $request->request->all();
        
    }
}
