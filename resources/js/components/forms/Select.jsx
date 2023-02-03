import React from 'react';

class Select extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<label>Select</label>
				<select className="custom-select form-control">
					<option>V1</option>
					<option>v2</option>
					<option>v3</option>
				</select>
			</div>
		)
	}
}

export default Select;