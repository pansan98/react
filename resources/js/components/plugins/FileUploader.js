import State from './State';

class FileUploader {
	constructor(config) {
		// デフォルトオプション
		const d_config = {
			files: [],
			errors: [],
			multiple: false,
			max_file: 1,
			max_file_size: 20, //MB
			mime_types: ['image/jpg', 'image/jpeg', 'image/png'],
			callbacks: {
				uploaded_fn: () => {}, // アップロード完了後に実行したい関数
				failed_fn: () => {} // アップロードが失敗した時に実行したい関数
			},
			callback_args: {// 受け取る時は展開する
				uploaded: [],
				failed: []
			},
			state: new State({
				states: ['none', 'uploading', 'uploaded', 'failed']
			})
		}

		// アップロードファイルをスタックする
		this.files = [];
		this.config = Object.assign(d_config, config);
	}

	upload(event) {
		if(this.config.state.__get() === 'none') {
			this.config.errors = [];
			this.files = (event.dataTransfer.files) ? event.dataTransfer.files : event.currentTarget.files;
			if(this.files.length) {
				this.files = Array.from(this.files);
				let file_count = 0;
				this.files = this.files.filter((file) => {
					if(file_count < this.config.max_file && this.get_size(file) <= this.config.max_file_size && this.filter_mime(file.type)) {
						file_count++;
						return true;
					}
					return false;
				})

				if(this.files.length) {
					this.config.state.__set('uploading');
					let files = 0;
					const done = this.done.bind(this);
					this.files.map((file) => {
						const reader = new FileReader();
						const uniq = new Date().getTime();
						reader.onload = () => {
							const src = reader.result;
							this.config.files.push({
								path: URL.createObjectURL(file),
								name: file.name,
								value: decodeURIComponent(src),
								identify_code: uniq,
								type: 'image',
								size: this.get_size(file, 'byte')
							})
							files++;
							done(files);
						}

						reader.onerror = () => {
							files++;
							const errors = {
								identify_code: uniq,
								value: file
							}
							this.config.errors.push(errors);
							if(typeof this.config.callbacks.failed_fn === 'function') {
								this.config.callback_args.failed.push(errors);
								this.config.callbacks.failed_fn(this.config.callback_args.failed);
							}
							done(files);
						}

						reader.readAsDataURL(file);
					})
				}
			}
		}
	}

	done(len) {
		if(this.files.length === len) {
			this.config.state.__set('uploaded');
			if(typeof this.config.callbacks.uploaded_fn === 'function') {
				this.config.callbacks.uploaded_fn(this.config.callback_args.uploaded);
			}
		}
	}

	/**
	 * 通知確認
	 */
	roger()
	{
		this.config.state.__set('none');
	}

	trash(identify) {
		if(this.config.files.length) {
			this.config.files = this.config.files.filter((v) => {
				return v.identify_code !== identify
			})
		}
		this.roger();
	}

	/**
	 * アップロードされたファイルのサイズを返す
	 * @param {*} file 
	 * @param {*} unit 
	 * @returns 
	 */
	get_size(file, unit = 'mb')
	{
		let size;
		switch(unit) {
			case 'mb':
				size = Math.floor(file.size / (1024 * 1024));
				break;
			default:
				size = file.size;
				break;
		}

		return size;
	}

	/**
	 * 許可されたMimeTypeか確認
	 * @param {*} mime 
	 * @returns 
	 */
	filter_mime(mime)
	{
		if(typeof this.config.mime_types === 'object') {
			return this.config.mime_types.includes(mime);
		}

		return false;
	}

	/**
	 * アップロードされたファイル情報を取得する
	 * @param {*} first 
	 * @returns 
	 */
	_flush(first)
	{
		let files;
		if(first) {
			for(let k in this.files) {
				files = this.files[k];
				break;
			}
		} else {
			files = this.files;
		}
		this.files = [];
		return files;
	}

	flush()
	{
		return this.config.files;
	}
}

export default FileUploader;