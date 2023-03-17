<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;

class EventRequest extends MyRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, mixed>
	 */
	public function rules()
	{
		return [
			'name' => ['required'],
			'comment' => ['nullable'],
			'thumbnails' => ['nullable'],
			'active_flag' => ['required', 'integer']
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			if($thumbnails = $this->get('thumbnails')) {
				if(!is_array($thumbnails)) {
					$validator->errors()->add('thumbnails', '正しいファイル情報ではないようです。');
				} else {
					if(!empty($thumbnails)) {
						foreach ($thumbnails as $t_key => $thumbnail) {
							if(empty($thumbnail['identify_code'])) {
								$validator->errors()->add('thumbnails', ($t_key +1) . 'つめは識別できないファイルです。');
							}
						}
					}
				}
			}
		});
	}
}
