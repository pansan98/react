<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Common;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class MyUser extends Model
{
	use HasFactory, Common;

	const GENDER = [
		1 => '男性',
		2 => '女性',
		3 => 'カスタム'
	];

	protected $table = 'my_users';
	protected $fillable = [
		'login_id', 'password', 'name', 'email', 'profession', 'gender', 'identify_code', 'social_uniq', 'thumbnail_id', 'active_sharing_id', 'two_authorize_flag', 'active_flag', 'delete_flag'
	];
	protected $hidden = ['login_id', 'password', 'delete_flag'];

	/**
	 * @return HasMany
	 */
	public function laps()
	{
		return $this->hasMany(\App\Models\PS\StopWatch::class, 'user_id', 'id');
	}

	/**
	 * @return HasOne
	 */
	public function thumbnail()
	{
		return $this->hasOne(\App\Models\MyMedia::class, 'id', 'thumbnail_id');
	}

	public function favorites()
	{
		return $this->belongsToMany(\App\Models\ShopProducts::class, 'shop_favorites', 'user_id', 'id', 'product_id', 'id');
	}

	public function access_token()
	{
		return $this->morphOne('\App\Models\AccessTokens', 'tokenable');
	}

	public static function labels($label)
	{
		$labels = [];
		switch($label) {
			case 'gender':
				$labels = self::GENDER;
				break;
		}

		return $labels;
	}

	public function gender_label()
	{
		$gender = '';
		if(isset(self::GENDER[$this->gender])) {
			$gender = self::GENDER[$this->gender];
		}

		return $gender;
	}
}
