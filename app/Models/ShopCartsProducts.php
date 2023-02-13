<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopCartsProducts extends Model
{
	use HasFactory;

	protected $table = 'shop_carts_products';
	protected $fillable = ['cart_id', 'product_id'];
}
