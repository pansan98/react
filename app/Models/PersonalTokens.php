<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PersonalTokens extends Model
{
	use HasFactory;

	protected $table = 'personal_tokens';
	protected $fillable = ['name', 'token', 'expired_at', 'used_at'];
	protected $hidden = ['token'];

	/**
	 * Find the token instance matching the given token.
	 *
	 * @param  string  $token
	 * @return static|null
	 */
	public static function findToken($token)
	{
		if (strpos($token, '|') === false) {
			return static::where('token', $token)->where('used_at', null)->first();
		}

		[$id, $token] = explode('|', $token, 2);

		if ($instance = static::find($id)) {
			return hash_equals($instance->token, hash('sha256', $token)) ? $instance : null;
		}
	}
}
