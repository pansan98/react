<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folders extends Model
{
    use HasFactory;

    protected $table = 'folders';
    protected $fillable = ['folderable_type', 'folderable_id', 'user_id', 'parent_id', 'name', 'level'];
}
