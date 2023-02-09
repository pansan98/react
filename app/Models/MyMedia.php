<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyMedia extends Model
{
    use HasFactory;

    protected $table = 'my_media';
    protected $fillable = ['mime', 'type', 'ext', 'path', 'name', 'identify_code'];
    protected $hidden = ['id'];
}
