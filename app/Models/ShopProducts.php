<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Traits\Common;

class ShopProducts extends Model
{
	use HasFactory, SoftDeletes, Common;

	protected $table = 'shop_products';
	protected $fillable = [
		'user_id', 'media_group_id', 'discount_id', 'identify_code', 'name', 'price', 'description', 'status', 'benefits', 'benefits_start', 'benefits_end', 'inventoly', 'inventoly_danger', 'max_purchase', 'fasted_delivery_day', 'customs'
	];

	public function thumbnails()
	{
		return $this->hasMany(\App\Models\MyMedia::class, 'media_group_id', 'media_group_id');
	}

	public function user()
	{
		return $this->hasOne(\App\Models\MyUser::class, 'id', 'user_id');
	}

	public function discount()
	{
		return $this->hasOne(\App\Models\ShopDiscounts::class, 'id', 'discount_id');
	}
}
