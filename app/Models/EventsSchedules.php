<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventsSchedules extends Model
{
    use HasFactory;

    protected $table = 'events_schedules';
    protected $fillable = ['event_id', 'schedule'];
}
