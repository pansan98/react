<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\JsonResponse;

trait MyJsonResponse
{
    public function failed($merge = [], $status = 400)
    {
        $response = array_merge([
            'result' => false
        ], $merge);

        return $this->response($response, $status);
    }

    public function success($merge = [], $status = 200)
    {
        $response = array_merge([
            'result' => true
        ], $merge);

        return $this->response($response, $status);
    }

    protected function response($response, $status)
    {
        return new JsonResponse($response, $status);
    }
}
