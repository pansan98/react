<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests\EventRequest;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Events;

class EventsController extends Controller
{
	public function index(Request $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$events = Events::with(['schedules'])
				->where('user_id', $user->id)
				->orderByDesc('id')
				->get()
				->toArray();
			return $this->success(['events' => $events]);
		}

		return $this->failed();
	}

	public function create(EventRequest $request)
	{
		$user = $this->myauth_provider->get();
		if($user) {
			$posts = $request->request->all();
			$posts['user_id'] = $user->id;
			if(!empty($posts['thumbnails'])) {
				/** @var \App\Providers\MediaServiceProvider $media_service */
				$media_service = app(\App\Providers\MediaServiceProvider::class);
				$media_group = $media_service->save($posts['thumbnails']);
				if($media_group) {
					$posts['media_group_id'] = $media_group->id;
				}
			}

			$ret = DB::transaction(function() use ($posts) {
				$event = new Events();
				$event->fill($posts)->save();
				return true;
			});
			if($ret) {
				return $this->success();
			}
		}

		return $this->failed();
	}
}
