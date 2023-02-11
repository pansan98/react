<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Multisort extends Model
{
    use HasFactory;

    protected $table = 'multisort';
    protected $fillable = ['base', 'key1', 'key2', 'key3', 'key4', 'key5', 'order_no'];
}
