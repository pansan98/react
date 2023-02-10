<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\MyMedia;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Log;

class MediaServiceProvider extends ServiceProvider
{
	protected $base_path;

	public function __construct(Application $app)
	{
		parent::__construct($app);
		$this->base_path = storage_path('media');
	}

	/**
	 * Register services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(MediaServiceProvider::class, function($app) {
			return new MediaServiceProvider($app);
		});
	}

	/**
	 * Bootstrap services.
	 *
	 * @return void
	 */
	public function boot()
	{
		//
	}

	public function add_path($path)
	{
		$path = ltrim($path, '/');
		$this->base_path = $this->base_path . '/' . $path;
		if(!file_exists($this->base_path)) {
			mkdir($this->base_path, 0777, true);
		}
		return $this;
	}

	public function save($thumbnails)
	{
		if(!empty($thumbnails)) {
			$keys = array_keys($thumbnails);
			if(isset($keys[0]) && is_numeric($keys[0])) {
				return $this->multiple($thumbnails);
			} else {
				return $this->single($thumbnails);
			}
		}

		return null;
	}

	protected function multiple($thumbnails)
	{

	}

	protected function single($thumbnail)
	{
		$params = [
			'identify_code' => $thumbnail['identify_code'],
			'name' => $thumbnail['name'],
			'size' => $thumbnail['size'],
			'type' => $thumbnail['type'],
			'path' => $thumbnail['value'],
			'ext' => $this->extension($thumbnail['name']),
			'mime' => $this->mime_for_ext($this->extension($thumbnail['name']))
		];

		$media = new MyMedia();
		$media->fill($params)->save();
		return $media;
	}

	protected function extension($f_name)
	{
		$extensions = explode('.', $f_name);
		$last_key = (count($extensions) - 1);
		$ext = isset($extensions[$last_key]) ? $extensions[$last_key] : '';

		return $ext;
	}

	protected function ext_for_mime($mime)
	{
		$ext = '';
		switch($mime) {
			case 'image/jpg':
			case 'image/jpeg':
				$ext = 'jpg';
				break;
			case 'image/png':
				$ext = 'png';
				break;
			case 'image/gif':
				$ext = 'gif';
				break;
		}

		return $ext;
	}

	protected function mime_for_ext($ext)
	{
		$mime = '';
		switch($ext) {
			case 'jpg':
			case 'jpeg':
			case 'JPG':
			case 'JPEG':
				$mime = 'image/jpg';
				break;
			case 'png':
			case 'PNG':
				$mime = 'image/png';
				break;
			case 'gif':
			case 'GIF':
				$mime = 'image/gif';
				break;
		}

		return $mime;
	}

	public function destroy($id)
	{
		$media = MyMedia::where('id', $id)->first();
		if($media) {
			$media->delete();
		}
	}
}
