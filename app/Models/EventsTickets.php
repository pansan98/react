<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventsTickets extends Model
{
	use HasFactory;

	protected $table = 'events_tickets';
	protected $fillable = ['schedule_id', 'booking_seet', 'seets'];

	public function schedule()
	{
		return $this->hasOne(\App\Models\EventsSchedules::class, 'id', 'schedule_id');
	}
}
