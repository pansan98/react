const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/build/assets/js')
	.react()
	.postCss('resources/css/app.css', 'public/build/assets/css', [
	]);