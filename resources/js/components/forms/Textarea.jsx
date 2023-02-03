import React from 'react';

class Textarea extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<label>Textarea</label>
				<textarea className="form-control" rows="3"></textarea>
			</div>
		)
	}
}

export default Textarea;