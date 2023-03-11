<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopFavorites extends Model
{
    use HasFactory;

    protected $table = 'shop_favorites';
    protected $fillable = ['user_id', 'product_id', 'folder_id'];
}
