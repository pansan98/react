<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Multisort extends Model
{
	use HasFactory;

	protected $table = 'multisort';
	protected $primaryKey = 'id';
	// キーが足りなきゃ追加
	protected $fillable = ['applyable_type', 'applyable_id', 'key1', 'key2', 'key3', 'key4', 'key5', 'order_no'];

	/**
	 *
	 * @param [type] $id
	 * @return bool
	 */
	public static function destroySort($class, $class_id, $args = [])
	{
		$ret = false;
		$query = self::where('applyable_type', get_class($class))
			->where('applyable_id', $class_id);
		foreach($args as $column => $arg) {
			$query->where('key' . ($column + 1), '=', $arg);
		}
		$multisort = $query->first();
		if($multisort) {
			$ret = DB::transaction(function() use ($multisort) {
				$multisort->delete();
				return true;
			});
		}
		return $ret;
	}

	public static function addSort($class, $id, $args = [], $pos = 'last')
	{
		$keys = [];
		foreach ($args as $argskey => $arg) {
			$keys['key' . ($argskey + 1)] = $arg;
		}

		switch($pos) {
			case 'first':
				$sort = self::first($class, $id, $keys);
				break;
			case 'last':
			default:
				$sort = self::last($class, $id, $keys);
				break;
		}

		$ret = DB::transaction(function() use ($class, $id, $sort, $keys) {
			$multisort = new Multisort();
			$multisort->fill(array_merge([
				'applyable_type' => get_class($class),
				'applyable_id' => $id,
				'order_no' => $sort
			], $keys))->save();
			return true;
		});
		return $ret;
	}

	/**
	 * 最後に挿入
	 *
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $keys
	 * @return void
	 */
	protected static function last($class, $id, $keys)
	{
		$query = self::select(DB::raw('MAX(multisort.order_no) AS max_order'))
			->where('applyable_type', get_class($class));
		foreach ($keys as $column => $key) {
			$query->where($column, '=', $key);
		}
		$multisort = $query->first();
		if(!$multisort) {
			return 1;
		}

		return ($multisort->max_order + 1);
	}

	/**
	 * 先頭に挿入
	 *
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $keys
	 * @return void
	 */
	protected static function first($class, $id, $keys)
	{
		$query = self::where('applyable_type', get_class($class));
		foreach($keys as $column => $key) {
			$query->where($column, '=', $key);
		}
		$multisorts = $query->orderBy('order_no', 'ASC')->get();
		if(!empty($multisorts)) {
			$ret = DB::transaction(function() use ($multisorts) {
				foreach ($multisorts->toArray() as $multisort) {
					$multisort->fill(['order_no' => ($multisort->order_no + 1)])->save();
				}
				return true;
			});
		}

		return 1;
	}
}
