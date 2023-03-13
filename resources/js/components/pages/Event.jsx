import React from 'react';
import {Link} from 'react-router-dom';

import Base from './Base';

class Event extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false
		}
	}

	contents() {
		return (<div>Event Contents.</div>)
	}

	render() {
		return (<Base title="イベント" content={this.contents()} loading={this.state.loading}/>)
	}
}

export default Event