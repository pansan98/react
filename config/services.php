<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    
    'social' => [
        'google' => [
            'client' => env('SOCIALLOGIN_GOOGLE_CLIENT_ID', '254697936169-dhascrbvqav0f4399616ehi7mnp7mt6j.apps.googleusercontent.com'),
            'secret' => env('SOCIALLOGIN_GOOGLE_SECRET', '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'),
            'callback' => env('SOCIALLOGIN_GOOGLE_CALLBACK_URL', 'http://react.practice.local.com/auth/social/google')
        ]
    ]
];
