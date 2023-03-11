<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
		return DB::transaction(function() use ($params) {
			$folder = new self();
			$folder->fill($params)->save();
			return true;
		});
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
			'parent_id' => $parent_id
		])->first();
		if($parent) {
			$level++;
			if($parent->parent_id) {
				return self::findLevel($class, $id, $apply, $parent->parent_id, $level);
			}
		}
		return $level;
	}

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
}
