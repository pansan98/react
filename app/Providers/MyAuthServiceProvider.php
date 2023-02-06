<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\MyUser;

class MyAuthServiceProvider extends ServiceProvider
{
    private $user;
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(MyAuthServiceProvider::class, function($app) {
            return new MyAuthServiceProvider($app);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $identify = session('identify', null);
        if(!empty($identify)) {
            $this->user = MyUser::where('identify_code', $identify)->first();
        }
    }

    public function get()
    {
        return $this->user;
    }

    public function auth()
    {
        return !empty($this->user);
    }
}
