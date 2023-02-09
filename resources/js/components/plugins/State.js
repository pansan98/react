import deepmerge from 'deepmerge';

class State {
	constructor(config) {
		const d_config = {
			state: 'none',
			states: ['none'],
			callbackfn: (obj) => {}
		}
		this.config = Object.assign(d_config, config);
	}

	__get() {
		return this.config.state;
	}

	__set(value) {
		if(this.filter(value)) {
			this.config.state = value;
			this.config.callbackfn(this);
		}
	}

	filter(value)
	{
		if(this.config.states.includes(value)) {
			return true;
		}
		return false;
	}
}

export default State;