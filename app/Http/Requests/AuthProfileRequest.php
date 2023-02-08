<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use App\Models\MyUser;

class AuthProfileRequest extends MyRequest
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
			'email' => ['nullable', 'email:filter'],
			'profession' => ['nullable'],
			'gender' => ['nullable', 'in:' . implode(',', array_keys(MyUser::GENDER)), 'integer']
		];
	}
}
