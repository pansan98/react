class requestBulk {
	constructor() {
		this.chunks = [];
		this.requested = 0;
	}

	set(chunks)
	{
		if(typeof chunks !== 'object') {
			console.error('typeof chunks does not object')
			return
		}
		this.chunks = chunks;
		return this;
	}

	async request(callback, errorfn, res) {
		const len = this.chunks.length;
		if(len) {
			if(typeof this.chunks[this.requested] !== 'undefined') {
				const res = await this.chunks[this.requested].execute().then((res) => {
					return res;
				}).catch((error) => {
					console.error(error)
					return {error: true, result: false, message: 'システムエラー'}
				})
				if(res.result && !res.error) {
					this.requested++;
					await this.request(callback, errorfn, res)
				} else {
					this.requested = 0;
					errorfn(res)
				}
			} else {
				this.requested = 0;
				callback(res)
			}
		}
	}
}