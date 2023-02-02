<?php

namespace App\Http\Controllers\Api\PS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\PS\StopWatch;
use App\Models\PS\StopWatchLap;
use Throwable;

class StopWatchController extends Controller
{
	public function index(Request $request)
	{
		$stop_watches = StopWatch::with(['laps'])->get()->toArray();
		return response()->json($stop_watches);
	}

	public function save(Request $request)
	{
		$res = [
			'result' => false
		];
		$params = $request->request->all();
		if(!empty($params)) {
			$res['result'] = DB::transaction(function() use ($params) {
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

				return true;
			});
		}

		return response()->json($res);
	}

	public function destroy(Request $request, $id)
	{
		$res = ['result' => false];
		try {
			$res['result'] = DB::transaction(function() use ($id) {
				$stop_watch = StopWatch::where('id', $id)->first();
				if($stop_watch) {
					$stop_watch->delete();
				}
				return true;
			});
		} catch(Throwable $e) {
		}

		return response()->json($res);
	}
}
