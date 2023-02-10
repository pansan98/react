<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopCarts extends Model
{
    use HasFactory;

    protected $table = 'shop_carts';
    protected $fillable = ['user_id', 'status'];
}
