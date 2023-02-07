<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\MyUser;
use Illuminate\Support\Facades\Log;

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
	}

	protected function add()
	{
		if(empty($this->user)) {
			$identify = session()->get('identify', null);
			if(!empty($identify)) {
				$this->user = MyUser::where('identify_code', $identify)
					->where('delete_flag', 0)
					->first();
			}
		}
	}

	public function get()
	{
		$this->add();
		return $this->user;
	}

	public function auth()
	{
		$this->add();
		return !empty($this->user);
	}
}
