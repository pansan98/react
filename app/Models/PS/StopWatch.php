<?php

namespace App\Models\PS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StopWatch extends Model
{
	use HasFactory;

	protected $table = 'practice_stopwatch_lap';
	protected $fillable = ['name', 'total_time'];
	protected $hidden = [];

	/**
	 * @return HasMany
	 */
	public function laps()
	{
		return $this->hasMany(\App\Models\PS\StopWatchLap::class, 'parent_id', 'id')->orderBy('lap_number', 'ASC');
	}
}
