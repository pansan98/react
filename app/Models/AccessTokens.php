<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Encryption\EncryptException;
use App\Models\Traits\Common;

class AccessTokens extends Model
{
	use HasFactory, Common;

	protected $table = 'access_tokens';
	protected $fillable = ['tokenable_type', 'tokenable_id', 'token', 'authorize_code', 'expired_at', 'used_at'];

	public static function findActiveAccessToken($class, $id, $token)
	{
		$token = Crypt::decryptString($token);
		return self::where('token', $token)
			->where('tokenable_type', get_class($class))
			->where('tokenable_id', $id)
			->where('used_at', null)
			->where('expired_at', '>', (new \DateTime())->format('Y-m-d H:i:s'))
			->first();
	}

	public static function findAccessToken($class, $id)
	{
		return self::where('tokenable_type', get_class($class))
			->where('tokenable_id', $id)
			->first();
	}

	public static function saveAccessToken($class, $id, $expire_sec = 3600)
	{
		$params = [
			'tokenable_type' => get_class($class),
			'tokenable_id' => $id,
			'token' => md5(self::identify_code(10)),
			'authorize_code' => self::identify_code(6),
			'expired_at' => (new \DateTime())->modify('+' . $expire_sec . ' seconds')->format('Y-m-d H:i:s')
		];

		list($token, $code) = DB::transaction(function() use ($params) {
			$access_token = new self();
			$access_token->fill($params)->save();
			return [Crypt::encryptString($access_token->token), $access_token->authorize_code];
		});

		return [$token, $code];
	}

	public static function refreshAccessToken($class, $id, $expire_sec = 3600)
	{
		$access_token = self::where('tokenable_type', get_class($class))
			->where('tokenable_id', $id)
			->first();
		if($access_token) {
			list ($token, $code) = DB::transaction(function() use ($access_token, $expire_sec) {
				$access_token->fill([
					'token' => md5(self::identify_code(10)),
					'authorize_code' => self::identify_code(6),
					'expired_at' => (new \DateTime())->modify('+' . $expire_sec . ' seconds')->format('Y-m-d H:i:s'),
					'used_at' => null
				])->save();

				return [Crypt::encryptString($access_token->token), $access_token->authorize_code];
			});

			return [$token, $code];
		}

		return [null, null];
	}

	public static function used(AccessTokens $access_token)
	{
		$ret = DB::transaction(function() use ($access_token) {
			$access_token->fill([
				'used_at' => (new \DateTime())->format('Y-m-d H:i:s')
			])->save();
			return true;
		});

		return $ret;
	}
}
