<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopCarts extends Model
{
	use HasFactory;

	protected $table = 'shop_carts';
	protected $fillable = ['user_id', 'status'];

	public function products()
	{
		return $this->belongsToMany(\App\Models\ShopProducts::class, 'shop_carts_products', 'cart_id', 'id', 'product_id', 'id');
	}
}
