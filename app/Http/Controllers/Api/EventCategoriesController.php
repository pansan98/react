<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\EventsCategories;
use App\Models\Multisort;

class EventCategoriesController extends Controller
{
	public function categories(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$categories = EventsCategories::where('user_id', $user->id)
				// ->join('multisort', function($query) use ($user) {
				// 	$query->on('multisort.key1', '=', 'events_categories.multisort')
				// 		->where('multisort.key2', '=', $user->id);
				// })
				// ->distinct()
				//->orderBy('multisort.order_no', 'ASC')
				->get()
				->toArray();
			return $this->success(['categories' => $categories]);
		}
		return $this->failed();
	}

	public function create(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'category' => ['required']
		]);
		if($validator->fails()) {
			return $this->failed([
				'errors' => $validator->errors()
			]);
		}

		$user = $this->myauth_provider->get();
		if($user) {
			$name = $request->request->get('category');
			$ret = DB::transaction(function() use ($name, $user) {
				$category = new EventsCategories();
				$category->fill([
					'user_id' => $user->id,
					'name' => $name,
					'multisort' => 'event_category'
				])->save();
				Multisort::addSort($category, $category->id, ['event_category', $user->id]);
				return true;
			});
			if($ret) {
				return $this->success();
			}
		}

		return $this->failed();
	}
}
