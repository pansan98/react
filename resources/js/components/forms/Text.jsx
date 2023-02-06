import React, {useState} from 'react';

class Text extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className="form-group">
				<label>{this.props.label}</label>
				<input type="text" className="form-control" name="text" value={this.props.value}/>
			</div>
		)
	}
}

export default Text;