import deepmerge from 'deepmerge';

class Loader {
	constructor(config) {
		this.d_config = {};
		this.config = deepmerge(this.d_config, config);
	}
}

export default Loader;