<?php

namespace App\Models\PS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StopWatchLap extends Model
{
    use HasFactory;

    protected $table = 'practice_stopwatch_laps';
    protected $fillable = ['parent_id', 'lap_number', 'lap_time'];
    protected $hidden = [];
}
