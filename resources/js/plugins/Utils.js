class Utils {
	constructor(){}

	dateformat(date, format) {
		if(typeof format === 'undefined') {
			format = 'yyyy年mm月dd日';
		}
		const d = new Date(date);

		format = format.replace(/yyyy/g, d.getFullYear());
		format = format.replace(/mm/g, (d.getMonth() + 1));
		format = format.replace(/dd/g, d.getDate());

		return format;
	}

	numberformat(number) {
		const formatter = new Intl.NumberFormat('ja-jp')
		return formatter.format(number)
	}

	async apiHandler(method, endpoint, params, final) {
		method = method.toUpperCase()
		return new Promise((resolve, reject) => {
			if(method === 'POST') {
				axios.post(endpoint, params).then((res) => {
					if(typeof res.data.login !== 'undefined') {
						if(!res.data.login) {
							reject({error: 'regenerate login'})
						}
					}
					resolve(res)
				}).catch((e) => {
					reject(e)
					this.errorHandler(e)
				}).finally(() => {
					if(typeof final === 'function') {
						final()
					}
				})
			} else {
				axios.get(endpoint, params).then((res) => {
					if(typeof res.data.login !== 'undefined') {
						if(!res.data.login) {
							reject({error: 'regenerate login'})
						}
					}
					resolve(res)
				}).catch((e) => {
					reject(e)
					this.errorHandler(e)
				}).finally(() => {
					if(typeof final === 'function') {
						final()
					}
				})
			}
		})
	}

	errorHandler(e) {
		throw new Error(e.message);
	}
}

export default Utils;