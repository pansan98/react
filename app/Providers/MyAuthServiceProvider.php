<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\MyUser;
use Illuminate\Support\Facades\DB;
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

	/**
	 * ログイン中のユーザーを追加する
	 */
	protected function add()
	{
		if(empty($this->user)) {
			$identify = session()->get('identify', null);
			if(!empty($identify)) {
				$this->user = MyUser::with(['thumbnail'])->where('identify_code', $identify)
					->where('delete_flag', 0)
					->whereNot('active_sharing_id')
					->first();
			}
		}
	}

	/**
	 * ログインしたユーザー識別コードを保持する
	 * @param [type] $identify
	 * @param \App\Models\SharingLogin $sharing
	 */
	public function retension($identify, \App\Models\SharingLogin $sharing)
	{
		$user = MyUser::where('identify_code', $identify)->first();
		if($user) {
			try {
				$ret = DB::transaction(function() use ($user, $sharing) {
					$user->fill(['active_flag' => 1, 'active_sharing_id' => $sharing->id])->save();
					return true;
				});
				if($ret) {
					session()->put('identify', $identify);
				}
			} catch(\Exception $e) {
				Log::warning($e->getMessage());
			}
		}
	}

	/**
	 * @return MyUser|Mixed
	 */
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
