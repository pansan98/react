<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Multisort extends Model
{
	use HasFactory;

	const KEYS = ['key1', 'key2', 'key3', 'key4', 'key5'];

	protected $table = 'multisort';
	protected $primaryKey = 'id';
	// キーが足りなきゃ追加
	protected $fillable = ['applyable_type', 'applyable_id', 'key1', 'key2', 'key3', 'key4', 'key5', 'order_no'];

	/**
	 *
	 * @param [type] $id
	 * @return bool
	 */
	public static function destroySort($class, $class_id, $args = [], $reorder = false)
	{
		$ret = false;
		$query = self::where('applyable_type', get_class($class))
			->where('applyable_id', $class_id);
		if(!empty($args)) {
			foreach($args as $column => $arg) {
				$query->where('key' . ($column + 1), '=', $arg);
			}
			if(count($args) < count(self::KEYS)) {
				$tasks = array_slice(self::KEYS, count($args));
				foreach ($tasks as $task) {
					$query->whereNull($task);
				}
			}
		} else {
			foreach (self::KEYS as $column) {
				$query->whereNull($column);
			}
		}

		$multisort = $query->first();
		if($multisort) {
			$ret = DB::transaction(function() use ($multisort) {
				$multisort->delete();
				return true;
			});
		}
		if($reorder) {
			$ret = self::reSort($class, $args);
		}
		return $ret;
	}

	/**
	 * 並び順の更新
	 *
	 * @param [type] $class
	 * @param [type] $args
	 * @param array $orders
	 * @return bool
	 */
	public static function reSort($class, $args, $orders = [])
	{
		$ret = false;
		$query = self::where('applyable_type', get_class($class))
			->orderBy('order_no', 'ASC');
		if(!empty($orders)) {
			$ret = DB::transaction(function() use ($query, $orders) {
				$sort = 1;
				foreach ($orders as $order) {
					$order_query = $query;
					$multisort = $order_query->where('applyable_id', $order)->first();
					if($multisort) {
						$multisort->order_no = $sort;
						$multisort->save();
						$sort++;
					}
				}
				return true;
			});
		} else {
			if(!empty($args)) {
				foreach ($args as $column => $arg) {
					$query->where('key' . ($column + 1), '=', $arg);
				}
				if(count($args) < count(self::KEYS)) {
					$tasks = array_slice(self::KEYS, count($args));
					foreach ($tasks as $task) {
						$query->whereNull($task);
					}
				}
			} else {
				foreach (self::KEYS as $column) {
					$query->whereNull($column);
				}
			}
			$multisorts = $query->get();
			if($multisorts) {
				$ret = DB::transaction(function() use ($multisorts) {
					$sort = 1;
					foreach($multisorts as $multisort) {
						$multisort->order_no = $sort;
						$multisort->save();
						$sort++;
					}
				});
			}
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
				$sort = self::first($class, $keys);
				break;
			case 'last':
			default:
				$sort = self::last($class, $keys);
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
	protected static function last($class, $keys)
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
	protected static function first($class, $keys)
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
