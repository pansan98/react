<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\MyUser;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Exceptions\HttpResponseException;

class AuthRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'login_id' => ['required', 'regex:/^[a-zA-Z0-9\-_]+$/', 'min:4', 'max:100'],
            'password' => ['required', 'regex:/^[a-zA-Z0-9]+$/', 'min:4', 'max:100', 'confirmed'],
            'password_confirmation' => ['required'],
            'email' => ['email:filter']
        ];
    }

    public function attributes()
    {
        return [
            'login_id' => 'Login ID',
            'password' => 'Password',
            'password_confirmation' => 'Password Try',
            'email' => 'Email'
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator)
    {
        $validator->after(function(Validator $validator) {
            if(!$this->get('login_id')) {
                return;
            }
        })
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => 400,
            'errors' => $validator->errors()
        ], 400));
    }
}
