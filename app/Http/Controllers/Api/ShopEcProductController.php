<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ShopProducts;

class ShopEcProductController extends Controller
{
    public function products(Request $request)
    {
        $user = $this->myauth_provider->get();
        if(!empty($user)) {
            $products = ShopProducts::with(['user', 'thumbnails'])
                ->where('user_id', '!=', $user->id)
                ->where('inventoly', '>', 0)
                ->where('deleted_at', null)
                ->orderByDesc('id')
                ->get()
                ->toArray();
            return $this->success(['products' => $products]);
        }

        return $this->failed();
    }

    public function product(Request $request, $identify)
    {
        $product = ShopProducts::with(['user', 'thumbnails'])
            ->where('identify_code', $identify)
            ->where('deleted_at', null)
            ->first()
            ->toArray();
        if($product) {
            return $this->success(['product' => $product]);
        }

        return $this->failed();
    }
}
