import React from 'react';
import {InfinitySpin} from 'react-loader-spinner';

import Style from '../../../sass/common/Loader';

class Loader extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.is_loading) {
			return (
				<div className={Style.loader}>
					<div className="overlay"></div>
					<InfinitySpin
						color="blue"
					/>
				</div>
			)
		}

		return (<div></div>)
	}
}

Loader.defaultProps = {
	is_loading: false
}

export default Loader;