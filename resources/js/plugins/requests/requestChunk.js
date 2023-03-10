class requestChunk {
	constructor(config) {
		const d_config = {
			url: '',
			options: {
				headers: {
					'Content-Type': 'application/json'
				},
				method: '',
				body: JSON.stringify({})
			},
			before_callback: () => {},
			callback: () => {}
		};
		this.config = Object.assign(d_config, config);
	}

	async execute() {
		return new Promise(async (resolve, reject) => {
			if(typeof this.config.before_callback === 'function') {
				this.config.before_callback()
			}
			const res = await fetch(this.config.url, this.config.options).then((res) => {
				return res.json()
			}).catch((e) => {
				reject({error: true, message: e})
			})

			if(typeof this.config.callback === 'function') {
				this.config.callback(res)
			}
			resolve(res)
		})
	}
}