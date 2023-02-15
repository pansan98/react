<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;

class ShopReviewRequest extends MyRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'star' => ['required', 'int'],
			'comment' => ['required']
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			$star = $this->get('star');
			if($star < 1 || $star > 5) {
				$validator->errors()->add('star', '星は1〜5段階で評価してください。');
			}
		});
	}
}
