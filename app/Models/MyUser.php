<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Common;

class MyUser extends Model
{
    use HasFactory, Common;

    protected $table = 'my_users';
    protected $fillable = ['login_id', 'password', 'name', 'email', 'identify_code', 'active_flag', 'delete_flag'];
    protected $hidden = ['login_id', 'password', 'delete_flag', 'id'];
}
