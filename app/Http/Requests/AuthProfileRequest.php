<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Models\MyUser;
use Illuminate\Support\Facades\Log;

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
			if($thumbnails = $this->get('thumbnail')) {
				if(!is_array($thumbnails)) {
					$validator->errors()->add('thumbnail', '正しいファイル情報ではないようです。');
				} else {
					if(!empty($thumbnails)) {
						// 単品で取得
						$thumbnail = isset($thumbnails[0]) ? $thumbnails[0] : [];
						if(empty($thumbnail['identify_code'])) {
							$validator->errors()->add('thumbnail', '識別できないファイルです。');
						}
					}
				}
			}

			if($two_authorize = $this->get('two_authorize')) {
				if(isset($two_authorize[0])) {
					/** @var \App\Providers\MyAuthServiceProvider $provider */
					$provider = app(\App\Providers\MyAuthServiceProvider::class);
					$user = $provider->get();
					if(!$user->email || !$this->get('email')) {
						$validator->errors()->add('two_authorize', '2段階認証を有効にするにはメールアドレスの設定が必要です。');
					}
				}
			}
		});
	}
}
