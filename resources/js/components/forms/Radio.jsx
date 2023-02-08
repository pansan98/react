import React from 'react';

class Radio extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				{this.props.values.map((v, k) => {
					const key = v.name + '-' + {k};
					return (
						<div key={k} className="form-check-input">
							<input type="radio" name={v.name} id={key}/>
							<label className="form-check-label" htmlFor={key}>{v.label}</label>
						</div>
					)
				})}
			</div>
		)
	}
}

export default Radio;