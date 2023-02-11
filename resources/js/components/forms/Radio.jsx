import React from 'react';

class Radio extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.values.length) {
			return (
				<div className="form-group">
					<label>{this.props.label}</label>
					{this.props.values.map((v, k) => {
						const key = this.props.formName + '-' + k;
						return (
							<div key={k} className="form-check">
								<input
									className="form-check-input"
									type="radio"
									value={v.value}
									name={this.props.formName}
									id={key}
									onChange={(e) => this.props.onChange(this.props.formName, e.currentTarget.value)}
									checked={this.props.value == v.value}
								/>
								<label className="form-check-label" htmlFor={key}>{v.label}</label>
							</div>
						)
					})}
				</div>
			)
		}

		return (<div className="form-group"><label>{this.props.label}</label></div>)
	}
}

Radio.defaultProps = {
	values: [],
	value: 0
}

export default Radio;