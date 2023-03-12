<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\Multisort;
use Illuminate\Support\Facades\Log;

class Folders extends Model
{
	use HasFactory;

	static protected $max_level = 5;

	protected $table = 'folders';
	protected $fillable = ['folderable_type', 'folderable_id', 'apply', 'parent_id', 'name', 'level'];

	/**
	 * フォルダの追加
	 *
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @param [type] $name
	 * @param [type] $parent
	 * @return void
	 */
	public static function create($class, $id, $apply, $name, $parent = null)
	{
		$params = [
			'folderable_type' => get_class($class),
			'folderable_id' => $id,
			'apply' => $apply,
			'name' => $name,
			'parent_id' => $parent
		];
		if($parent) {
			$level = self::findLevel($class, $id, $apply, $parent);
			if($level > self::$max_level) {
				return false;
			}
			$params['level'] = $level;
		}
		$folder = DB::transaction(function() use ($params) {
			$folder = new self();
			$folder->fill($params)->save();
			return $folder;
		});

		$ancestor = self::ancestorFolders($folder, $class, $id, $apply);
		$keys = self::ancestorToMultisorts($ancestor);
		return Multisort::addSort($folder, $folder->id, $keys);
	}

	/**
	 * 階層レベルの取得
	 *
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @param [type] $parent_id
	 * @param integer $level
	 * @return void
	 */
	public static function findLevel($class, $id, $apply, $parent_id, $level = 1)
	{
		$parent = self::where([
			'folderable_type' => get_class($class),
			'folderable_id' => $id,
			'apply' => $apply,
			'id' => $parent_id
		])->first();
		if($parent) {
			$level++;
			if($parent->parent_id) {
				return self::findLevel($class, $id, $apply, $parent->parent_id, $level);
			}
		}
		return $level;
	}

	/**
	 * 兄弟フォルダを取得
	 *
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @param [type] $parent
	 * @return self
	 */
	public static function findFolders($class, $id, $apply, $parent = null)
	{
		$query = self::where('folderable_type', get_class($class))
			->where('folderable_id', $id)
			->where('apply', $apply);
		
		if($parent) {
			$query->where('parent_id', $parent);
		} else {
			$query->whereNull('parent_id');
		}

		return $query->get();
	}

	/**
	 * ツリー上でフォルダを取得
	 *
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @param [type] $parent_id
	 * @return void
	 */
	public static function treeFolders($class, $id, $apply, $parent_id = null)
	{
		$query = self::where('folderable_type', get_class($class))
			->where('folderable_id', $id)
			->where('apply', $apply);
		if($parent_id) {
			$query->where('parent_id', $parent_id);
		} else {
			$query->whereNull('parent_id');
		}

		$folders = $query->get()->toArray();
		foreach ($folders as &$folder) {
			$children = self::treeFolders($class, $id, $apply, $folder['id']);
			if(!empty($children)) {
				$folder['children'] = $children;
			}
		}

		return $folders;
	}

	/**
	 * 単品でフォルダを取得
	 *
	 * @param [type] $folder_id
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @return self
	 */
	public static function findFolder($folder_id, $class, $id, $apply)
	{
		return self::where('id', $folder_id)
			->where('folderable_type', get_class($class))
			->where('folderable_id', $id)
			->where('apply', $apply)
			->first();
	}

	/**
	 * フォルダを削除
	 *
	 * @param [type] $folder_id
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @return bool
	 */
	public static function destroyFolder($folder_id, $class, $id, $apply)
	{
		$ret = false;
		$folder = self::where('id', $folder_id)
			->where('folderable_type', get_class($class))
			->where('folderable_id', $id)
			->where('apply', $apply)
			->first();

		if($folder) {
			$ancestor = self::ancestorFolders($folder, $class, $id, $apply);
			Multisort::destroySort($folder, $folder->id, self::ancestorToMultisorts($ancestor));
			$ret = DB::transaction(function() use ($folder) {
				$folder->delete();
				return true;
			});
		}

		return $ret;
	}

	/**
	 * 先祖リストを取得
	 *
	 * @param self $folder
	 * @param [type] $class
	 * @param [type] $id
	 * @param [type] $apply
	 * @return self
	 */
	protected static function ancestorFolders(self $folder, $class, $id, $apply)
	{
		if($folder->parent_id) {
			$parent_folder = self::where('folderable_type', get_class($class))
				->where('folderable_id', $id)
				->where('apply', $apply)
				->where('id', $folder->parent_id)
				->first();
			$parent_folder->child = $folder;
			return self::ancestorFolders($parent_folder, $class, $id, $apply);
		} else {
			return $folder;
		}
	}

	/**
	 * Multisort用にキーとなる配列を生成します。
	 *
	 * @param self $folder
	 * @param array $args
	 * @return array
	 */
	protected static function ancestorToMultisorts(self $folder)
	{
		$args = self::ancestorMultisortsKeys($folder);
		// 最後のキーは自身なのでいらない
		$lastkey = array_key_last($args);
		unset($args[$lastkey]);
		return $args;
	}

	protected static function ancestorMultisortsKeys(self $folder, $args = [])
	{
		$args[] = $folder->id;
		if($folder->child) {
			return self::ancestorMultisortsKeys($folder->child, $args);
		}
		return $args;
	}
}
