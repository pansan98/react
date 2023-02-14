<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopPurchase extends Model
{
    use HasFactory;

    protected $table = 'shop_purchase';
    protected $fillable = ['user_id'];

    public function histories()
    {
        return $this->hasMany(\App\Models\ShopPurchaseHistories::class, 'purchase_id', 'id');
    }
}
