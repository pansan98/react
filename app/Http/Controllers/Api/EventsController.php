<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
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
}
