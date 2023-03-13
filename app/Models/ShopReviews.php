<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ShopReviews extends Model
{
	use HasFactory;

	const STARTS = [
		1, 2, 3, 4, 5
	];

	protected $table = 'shop_reviews';
	protected $fillable = ['product_id', 'user_id', 'star', 'comment', 'viewed'];

	public function user()
	{
		return $this->hasOne(\App\Models\MyUser::class, 'id', 'user_id');
	}

	/**
	 *
	 * @param self $review
	 * @return bool
	 */
	public static function viewed(self $review)
	{
		if($review->viewed) return true;
		$ret = DB::transaction(function() use ($review) {
			$review->fill(['viewed' => true])->save();
			return true;
		});
		return $ret;
	}
}
