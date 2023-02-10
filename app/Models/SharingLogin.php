<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharingLogin extends Model
{
    const MAX_USE = 3;
    use HasFactory;

    protected $table = 'sharing_login';
    protected $fillable = ['user_id', 'os', 'ip'];
    protected $hidden = [];
}
