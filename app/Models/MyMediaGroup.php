<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MyMedia;

class MyMediaGroup extends Model
{
    use HasFactory;

    protected $table = 'my_media_group';

    public function thumbnails()
    {
        return $this->hasMany(MyMedia::class, 'media_group_id', 'id');
    }
}
