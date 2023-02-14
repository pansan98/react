<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopPurchaseHistories extends Model
{
	use HasFactory;

	protected $table = 'shop_purchase_histories';
	protected $fillable = ['purchase_id', 'product_id'];
}
