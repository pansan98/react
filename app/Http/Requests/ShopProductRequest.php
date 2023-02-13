<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;
use App\Models\ShopProducts;

class ShopProductRequest extends MyRequest
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
			'price' => ['required', 'integer'],
			'thumbnails' => ['nullable'],
			'identify_code' => ['nullable', 'min:10'],
			'description' => ['nullable'],
			'benefits' => ['nullable'],
			'benefits_start' => ['nullable'],
			'benefits_end' => ['nullable'],
			'inventoly' => ['required', 'integer'],
			'inventoly_danger' => ['nullable', 'integer'],
			'max_purchage' => ['nullable', 'integer'],
			'fasted_delivery_day' => ['nullable', 'integer'],
			'customs' => ['nullable']
		];
	}

	public function attributes()
	{
		return [
			'name' => '商品名',
			'price' => '商品価格',
			'inventoly' => '在庫数'
		];
	}

	public function withValidator(\Illuminate\Validation\Validator $validator)
	{
		$validator->after(function(Validator $validator) {
			$id = $this->get('id');
			if($price = $this->get('price')) {
				if($price < 100) {
					$validator->errors()->add('price', '商品価格は100円未満は設定できません。');
				}
			}

			if($identify = $this->get('identify_code') && !$id) {
				/** @var \App\Providers\MyAuthServiceProvider $provider */
				$provider = app(\App\Providers\MyAuthServiceProvider::class);
				$user = $provider->get();
				if(!empty($user)) {
					$product = ShopProducts::where('identify_code', $identify)
						->where('user_id', $user->id)
						->where('deleted_at', null)
						->first();
					if($product) {
						$validator->errors()->add('identify_code', 'すでに利用している識別コードです。');
					}
				}
			}

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
