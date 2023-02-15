<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopDiscounts extends Model
{
    use HasFactory;

    protected $table = 'shop_discounts';
    protected $fillable = ['name', 'discount', 'type', 'coupon_code', 'discount_start', 'discount_end'];
}
