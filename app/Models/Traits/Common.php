<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;

trait Common {
    public static function identify_code($num = 15)
    {
        return Str::random($num);
    }
}