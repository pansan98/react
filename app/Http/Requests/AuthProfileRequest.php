<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;
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
			'gender' => ['nullable', 'in:' . implode(',', array_keys(MyUser::GENDER)), 'integer'],
			'thumbnail' => ['nullable']
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			if(!$this->get('thumbnail')) {
				return;
			}

			$thumbnails = $this->get('thumbnail');
			if(!is_array($thumbnails)) {
				$validator->errors()->add('thumbnail', '正しいファイル情報ではないようです。');
			} else {
				// 単品で取得
				$thumbnail = array_slice($thumbnails, 0, 1);
				if(empty($thumbnail['identify_code'])) {
					$validator->errors()->add('thumbnail', '識別できないファイルです。');
				}
			}
		})
	}
}
