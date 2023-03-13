<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
	use HasFactory;
	
	protected $table = 'events';
	protected $fillable = ['user_id', 'media_group_id', 'name', 'comment', 'active_flag'];
}
