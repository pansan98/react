<?php

namespace App\Http\Requests;

use App\Http\Requests\MyRequest;
use Illuminate\Contracts\Validation\Validator;

class ShopProductRequest extends Myrequest
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
}
