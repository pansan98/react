<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\MyUser;

class MyAuth
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
	 * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
	 */
	public function handle(Request $request, Closure $next)
	{
		$identify = $request->session()->get('identify', null);
		if(empty($identify)) {
			return redirect()->to('/auth/login');
		} else {
			$user = MyUser::where('identify_code', $identify)
				->where('delete_flag', 0)
				->first();
			if(empty($user)) {
				return redirect()->to('/auth/login');
			}
		}
		return $next($request);
	}
}
