import deepMerge from 'deepmerge';

class Loader {
	constructor(config) {
		this.d_config = {};
		this.config = deepMerge(this.d_config, config);
	}
}

export default Loader;