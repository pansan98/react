import React from 'react';

class Checkbox extends React.Component {
	constructor(props) {
		super(props);
	}

	onChange(e) {
		let values = this.props.value;
		if(!this.props.value.includes(this.parse(e.currentTarget.value))) {
			values.push(this.parse(e.currentTarget.value));
		} else {
			values = this.props.value.filter((v, k) => {
				return v !== this.parse(e.currentTarget.value)
			});
		}
		this.props.onChange(this.props.formName, values);
	}

	parse(value) {
		if((new RegExp(/[0-9]+/)).test(value)) {
			return parseInt(value);
		}

		return value;
	}

	render() {
		if(this.props.values.length) {
			return (
				<div className="form-group">
					<label>{this.props.label}</label>
					<div className="custom-control custom-checkbox">
						{this.props.values.map((v, k) => {
							const key = this.props.formName + '-' + k;
							let checked = false;
							if(this.props.value.includes(this.parse(v.value))) {
								checked = true;
							}

							return (
								<div key={k}>
									<input
										type="checkbox"
										value={v.value}
										name={this.props.formName}
										className="custom-control-input"
										id={key}
										onChange={(e) => this.onChange(e)}
										checked={checked}
									/>
									<label className="custom-control-label" htmlFor={key}>{v.label}</label>
								</div>
							)
						})}
					</div>
				</div>
			)
		}

		return (<div className="form-group"><label>{this.props.label}</label></div>)
	}
}

Checkbox.defaultProps = {
	values: [],
	value: []
}

export default Checkbox;