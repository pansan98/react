<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ShopFavoritesProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(ShopFavoritesProvider::class, function($app) {
            return new ShopFavoritesProvider($app);
        });
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
