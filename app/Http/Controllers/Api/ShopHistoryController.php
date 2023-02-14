<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ShopHistoryController extends Controller
{
    public function index(Request $request)
    {
        $user = $this->myauth_provider->get();
        if($user) {
            /** @var \App\Providers\ShopHistoryProvider $provider */
            $provider = app(\App\Providers\ShopHistoryProvider::class);
            $histories = $provider->histories($user);
            return $this->success(['histories' => $histories]);
        }
        return $this->failed();
    }
}
