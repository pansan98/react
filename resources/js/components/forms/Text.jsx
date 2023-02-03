import React from 'react';

class Text extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<label>テキスト</label>
				<input type="text" className="form-control" name="text"/>
			</div>
		)
	}
}

export default Text;