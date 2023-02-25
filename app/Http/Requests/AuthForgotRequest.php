<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Models\MyUser;
use App\Models\SocialTokens;

class AuthForgotRequest extends MyRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'forgot' => ['required']
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			if($forgot = $this->get('forgot')) {
				$user = MyUser::where(function($query) use ($forgot) {
					$query->orWhere('login_id', $forgot)
						->orWhere('email', $forgot);
				})->where('delete_flag', 0)
					->first();
				if(!$user) {
					$validator->errors()->add('forgot', 'ユーザーが見つかりません。');
				} else {
					// ソーシャルログインを考慮
					$social = SocialTokens::where('user_id', $user->id)->first();
					if($social) {
						$validator->errors()->add('forgot', 'このユーザーは別ルートで登録されています。');
					} else {
						if(!$user->email) {
							$validator->errors()->add('forgot', 'パスワードの再設定を申請できません。');
						}
					}
				}
			}
		});
	}
}
