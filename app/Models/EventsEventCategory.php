<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventsEventCategory extends Model
{
	use HasFactory;

	protected $table = 'events_event_category';
	protected $fillable = ['event_id', 'category_id'];
}
