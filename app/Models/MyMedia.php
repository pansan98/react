<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Common;

class MyMedia extends Model
{
	use HasFactory, Common;

	protected $table = 'my_media';
	protected $fillable = ['mime', 'type', 'ext', 'size', 'path', 'name', 'identify_code', 'media_group_id'];
	protected $hidden = ['created_at', 'updated_at', 'media_group_id'];
}
