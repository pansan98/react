<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Controllers\Controller;
use App\Providers\MyAuthServiceProvider;
use App\Models\MyUser;
use Illuminate\Support\Facades\DB;
use Throwable;

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
        $params['password'] = password_hash($params['password'], PASSWORD_DEFAULT);
        $params['identify_code'] = MyUser::identify_code();
        $res = ['result' => false];
        $res['result'] = DB::transaction(function() use ($params) {
            $my_user = new MyUser();
            $my_user->fill($params)->save();
            return true;
        });

        return response()->json($res);
    }
}
