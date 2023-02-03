import React from 'react';

class Radio extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<div className="form-check-input">
					<input type="radio" name="radio" id="radio1"/>
					<label className="form-check-label" htmlFor="radio1">Radio1</label>
				</div>
				<div className="form-check-input">
					<input type="radio" name="radio" id="radio2"/>
					<label className="form-check-label" htmlFor="radio2">Radio2</label>
				</div>
				<div className="form-check-input">
					<input type="radio" name="radio" id="radio3"/>
					<label className="form-check-label" htmlFor="radio3">Radio3</label>
				</div>
			</div>
		)
	}
}

export default Radio;