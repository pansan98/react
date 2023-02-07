<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use App\Models\MyUser;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;

class AuthRegisterRequest extends MyRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'name' => ['required', 'max:100'],
			'login_id' => ['required', 'regex:/^[a-zA-Z0-9\-_]+$/', 'min:4', 'max:50'],
			'password' => ['required', 'regex:/^[a-zA-Z0-9]+$/', 'min:4', 'max:100', 'confirmed'],
			'password_confirmation' => ['required'],
			'email' => ['nullable', 'email:filter']
		];
	}

	public function attributes()
	{
		return [
			'login_id' => 'Login ID',
			'password' => 'Password',
			'password_confirmation' => 'Password Try',
			'email' => 'Email'
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			if(!$this->get('login_id')) {
				return;
			}

			$my_user = MyUser::where('login_id', $this->input('login_id'))->first();
			if(!empty($my_user)) {
				$validator->errors()->add('login_id', 'すでに利用されているログインIDです。');
			}
		});
	}
}
