<?php

namespace App\Http\Controllers\Api\PS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PS\StopWatch;
use App\Models\PS\StopWatchLap;

class StopWatchController extends Controller
{
	public function index(Request $request)
	{
		return response()->json([]);
	}

	public function save(Request $request)
	{
		$res = [
			'result' => false
		];
		$params = $request->request->all();
		if(!empty($params)) {
			DB::transaction(function() use ($params) {
				$stop_watch = new StopWatch();
				$stop_watch->fill($params)->save();
				if(!empty($params['laps'])) {
					foreach($params['laps'] as $lap) {
						$stop_watch_lap = new StopWatchLap();
						$stop_watch_lap->fill([
							'parent_id' => $stop_watch->id,
							'lap_number' => intval($lap['number']),
							'lap_time' => $lap['time']
						])->save();
					}
				}

				$res['result'] = true;
			});
		}

		return response()->json($res);
	}
}
