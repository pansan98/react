<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventsTicketsBooking extends Model
{
	use HasFactory;

	protected $table = 'events_tickets_booking';
	protected $fillable = ['event_ticket_id', 'user_id'];
}
