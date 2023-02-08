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
		this.build();
	}

	build()
	{
		if(this.options.wrapper) {
			const dropzone = this.options.wrapper.querySelector('#' + this.options.dropzone_id);
			if(dropzone) {
				dropzone.addEventListener('dragover', (e) => {
					e.preventDefault();
					dropzone.classList.add('dragover');
				});
				dropzone.addEventListener('dragleave', (e) => {
					e.preventDefault();
					dropzone.classList.remove('dragover');
				});
				dropzone.addEventListener('drop', async (e) => {
					e.preventDefault();
					dropzone.classList.remove('dragover');
					const files = e.dataTransfer.files;
					await this.upload(files);
				});
			}

			const btn_cancels = this.options.wrapper.querySelectorAll('.' + this.options.cancel_class);
			if(btn_cancels) {
				for(let bci = 0; bci < btn_cancels.length; bci++) {
					btn_cancels[bci].addEventListener('click', (e) => {
						e.preventDefault();
						let name;
						if(this.options.multiple) {
							name = e.currentTarget.getAttribute('data-name');
						}
						this.cancel(name);
					})
				}
			}
		}
	}

	async upload(files)
	{
		Loader.enable();
		if(files.length) {
			const f_posts = [];
			if(this.options.multiple && (this.options.max_file > this.files.length)) {
				const total = (this.files.length + files.length);
				if(this.options.max_file >= total) {
					for(let i = 0; i < (this.options.max_file - this.files.length); i++) {
						if(typeof files[i] !== 'undefined') {
							const mb = this.get_size(files[i]);
							if(this.options.max_file_size > mb && this.filter_mime(files[i].type)) {
								f_posts.push(files[i]);
							}
						}
					}
				} else {
					this.alert.warning('これ以上はアップロードできません。');
					Loader.disable();
					return;
				}
			} else {
				const mb = this.get_size(files[0]);
				if(this.options.max_file_size > mb && this.filter_mime(files[0].type)) {
					f_posts.push(files[0]);
				}
			}

			if(f_posts.length) {
				const fd = new FormData();
				for(let k in f_posts) {
					fd.append('file', f_posts[k]);
				}
				fd.append('mime_types', this.options.mime_types);
				let endpoint;
				if(this.options.multiple) {
					endpoint = '/api/media/multiupload';
				} else {
					endpoint = '/api/media/upload';
				}

				const json = await fetch(endpoint, {
					method: 'POST',
					body: fd
				}).then((res) => {
					if(res.ok) {
						return res.json();
					}
				}).catch((e) => {
					console.log(e.message);
					return {status: false}
				});

				if(json.status) {
					this.alert.success('アップロードに成功しました。')
					this.preview(json.files);
					this.options.callbacks.uploaded_callbackfn(this.options.callback_args.uploaded);
				} else {
					this.alert.error('アップロードに失敗しました。');
					this.options.callbacks.failed_callbackfn(this.options.callback_args.failed);
				}
			}
		}
		Loader.disable();
	}

	async cancel(name)
	{
		Loader.enable();
		const inputs = [];
		if(this.files.length) {
			for(let k in this.files) {
				if(name) {
					if(this.files[k].name == name) {
						inputs.push(this.files[k]);
					}
				} else {
					inputs.push(this.files[k]);
				}
			}
		}

		if(inputs.length) {
			const json = await fetch('/api/media/cancel', {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(inputs)
			}).then((res) => {
				if(res.ok) {
					return res.json();
				}
			}).catch((e) => {
				console.log(e.message);
				return {status: false}
			})

			if(json.status) {
				this.alert.success('アップロードをキャンセルしました。');
				this.reset_values(name);
			} else {
				this.alert.error('アップロードをキャンセルできませんでした。');
			}
		}

		Loader.disable();
	}

	/**
	 * アップロードしたファイルのプレビューを表示
	 * @param {*} json 
	 */
	preview(files)
	{
		for(let i in files) {
			if(this.options.values.length) {
				const values = {};
				for(let k in this.options.values) {
					if(typeof files[i][this.options.values[k]] !== 'undefined') {
						values[this.options.values[k]] = files[i][this.options.values[k]]
					}
				}
	
				this.files.push(values);
			}
	
			const wrapper = this.options.wrapper.querySelector('#' + this.options.uploaded_id);
			const preview = wrapper.querySelector('.' + this.options.preview_class);

			if(!this.options.multiple) {
				const dropzone = this.options.wrapper.querySelector('#' + this.options.dropzone_id);
				dropzone.style.display = 'none';
				if(preview) {
					preview.src = files[i].path;
					preview.onload = () => {
						wrapper.style.display = 'block';
					}
				}
			} else {
				if(preview) {
					const p_wrapper = $(preview).closest('.' + this.options.multiple_preview_class).get(0);
					if(preview.src === 'data:,') {
						if(this.options.max_file < this.files.length) {
							const dropzone = this.options.wrapper.querySelector('#' + this.options.dropzone_id);
							dropzone.style.display = 'none';
						}
	
						preview.src = files[i].path;
						preview.onload = () => {
							wrapper.style.display = 'block';
						}
						p_wrapper.setAttribute('data-file-name', files[i].name);
						const btn_cancel = p_wrapper.querySelector('.' + this.options.cancel_class);
						btn_cancel.setAttribute('data-name', files[i].name);
					} else {
						if(p_wrapper) {
							const _clone = p_wrapper.cloneNode(true);
							_clone.setAttribute('data-file-name', files[i].name)
							const c_preview = _clone.querySelector('.' + this.options.preview_class);
							if(c_preview) {
								c_preview.src = files[i].path;
							}
	
							const c_cancel = _clone.querySelector('.' + this.options.cancel_class);
							if(c_cancel) {
								c_cancel.setAttribute('data-name', files[i].name);
								c_cancel.addEventListener('click', (e) => {
									e.preventDefault();
									const name = e.currentTarget.getAttribute('data-name');
									this.cancel(name);
								})
							}
	
							wrapper.append(_clone);
						}
					}
				}
			}
		}
	}

	/**
	 * 値をクリアする
	 */
	reset_values(name)
	{
		// for(let k in this.options.inputs) {
		// 	const node = this.options.wrapper.querySelector('#' + this.options.inputs[k]);
		// 	if(node) {
		// 		node.value = '';
		// 	}
		// }
		if(this.options.multiple) {
			if(name) {
				const files = this.files;
				for(let k in files) {
					if(typeof files[k].name !== 'undefined' && files[k].name === name) {
						delete files[k];
						this.files = files.filter(Boolean);
					}
				}
				const p_wrappers = this.options.wrapper.querySelectorAll('.' + this.options.multiple_preview_class);
				if(p_wrappers.length) {
					if(this.files.length) {
						for(let i = 0; i < p_wrappers.length; i++) {
							if(p_wrappers[i].getAttribute('data-file-name') === name) {
								p_wrappers[i].parentNode.removeChild(p_wrappers[i]);
							}
						}
					}
				}
			} else {
				this.files = [];
			}

			if(!this.files.length) {
				const dropzone = this.options.wrapper.querySelector('#' + this.options.dropzone_id);
				if(dropzone) {
					dropzone.style.display = 'block';
				}

				const uploaded = this.options.wrapper.querySelector('#' + this.options.uploaded_id);
				if(uploaded) {
					uploaded.style.display = 'none';
					const preview = uploaded.querySelector('.' + this.options.preview_class);
					if(preview) {
						preview.src = 'data:,';
					}
				}
			} else {
				const dropzone = this.options.wrapper.querySelector('#' + this.options.dropzone_id);
				if(dropzone) {
					dropzone.style.display = 'block';
				}
			}
		} else {
			this.files = [];
			const dropzone = this.options.wrapper.querySelector('#' + this.options.dropzone_id);
			if(dropzone) {
				dropzone.style.display = 'block';
			}

			const uploaded = this.options.wrapper.querySelector('#' + this.options.uploaded_id);
			if(uploaded) {
				uploaded.style.display = 'none';
				const preview = uploaded.querySelector('.' + this.options.preview_class);
				if(preview) {
					preview.src = 'data:,';
				}
			}
		}
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
		if(typeof this.options.mime_types === 'object') {
			return this.options.mime_types.includes(mime);
		}

		return false;
	}

	/**
	 * アップロードされたファイル情報を取得する
	 * @param {*} first 
	 * @returns 
	 */
	flush(first)
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

	uploaded() {
		return this.config.uploaded;
	}
}

export default FileUploader;