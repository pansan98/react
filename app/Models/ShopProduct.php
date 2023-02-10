<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShopProducts extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'shop_products';
    protected $fillable = [
        'user_id', 'name', 'price', 'description', 'benefits', 'benefits_start', 'benefits_end', 'inventoly', 'max_purchase', 'fasted_delivery_day', 'customs'
    ];
}
