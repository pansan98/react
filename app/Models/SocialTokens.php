<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialTokens extends Model
{
    use HasFactory;

    protected $table = 'social_tokens';
    protected $fillable = ['user_id', 'provider', 'token', 'expired_at'];
    protected $hidden = ['id'];
}
