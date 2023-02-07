<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use App\Models\MyUser;
use Illuminate\Contracts\Validation\Validator;

class AuthLoginRequest extends MyRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'login_id' => ['required', 'regex:/^[a-zA-Z0-9\-_]+$/'],
			'password' => ['required', 'regex:/^[a-zA-Z0-9]+$/']
		];
	}

	public function attributes()
	{
		return [
			'login_id' => 'Login ID',
			'password' => 'Password'
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			if(!$this->get('login_id') || !$this->get('password')) {
				return;
			}

			$user = MyUser::where('login_id', $this->get('login_id'))
				->where('delete_flag', 0)
				->first();
			if(empty($user)) {
				$validator->errors()->add('login_error', 'ログインできません。');
			} else {
				if(!password_verify($this->get('password'), $user->password)) {
					$validator->errors()->add('login_error', 'ログインできません。');
				}
			}
		});
	}
}
