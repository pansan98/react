import React from 'react';

class Select extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<label>{this.props.label}</label>
				<select className="custom-select form-control" value={this.props.value} onChange={(e) => this.props.onChange(this.props.formName, e.currentTarget.value)}>
					{this.props.values.map((v, k) => {
						return (
							<option
								key={k}
								value={v.value}
							>
								{v.label}
							</option>
						)
					})}
				</select>
			</div>
		)
	}
}

Select.defaultProps = {
	label: 'Select',
	value: 0,
	values: [
		{
			label: 'V1',
			value: 1
		},
		{
			label: 'V2',
			value: 2
		},
		{
			label: 'V3',
			value: 3
		}
	]
}

export default Select;