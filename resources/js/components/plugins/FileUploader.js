import deepmerge from 'deepmerge';

class FileUploader {
	constructor(config) {
		// デフォルトオプション
		const d_config = {
			multiple: false,
			max_file: 1,
			max_file_size: 20, //MB
			mime_types: ['image/jpg', 'image/jpeg', 'image/png'],
			callbacks: {
				uploaded_callbackfn: () => {}, // アップロード完了後に実行したい関数
				failed_callbackfn: () => {} // アップロードが失敗した時に実行したい関数
			},
			callback_args: {// 受け取る時は展開する
				uploaded: [],
				failed: []
			},
			values: ['path', 'name', 'ext', 'mime']
		};

		// アップロードファイルをスタックする
		this.files = [];
		this.config = deepmerge(d_config, config);
	}

	uploaded() {
		return this.config.uploaded;
	}
}

export default FileUploader;