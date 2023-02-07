<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Common;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MyUser extends Model
{
    use HasFactory, Common;

    protected $table = 'my_users';
    protected $fillable = ['login_id', 'password', 'name', 'email', 'identify_code', 'active_flag', 'delete_flag'];
    protected $hidden = ['login_id', 'password', 'delete_flag'];

    /**
     * @return HasMany
     */
    public function laps()
    {
        return $this->hasMany(\App\Models\PS\StopWatch::class, 'user_id', 'id');
    }
}
