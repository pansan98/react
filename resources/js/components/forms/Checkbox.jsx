import React from 'react';

class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.values = [];
	}

	componentDidMount() {
		this.values = this.props.value;
	}

	onChange(e) {
		if(!this.props.value.includes(e.currentTarget.value)) {
			this.values.push(this.parse(e.currentTarget.value));
		} else {
			this.values = this.props.value.filter((v, k) => {
				return e.currentTarget.value !== v
			})
			// TODO checkedの処理
			console.log(this.values);
		}

		this.props.onChange(this.props.formName, this.values);
		this.values = this.props.value;
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
					<div className="form-check">
						{this.props.values.map((v, k) => {
							const key = this.props.formName + '-' + k;
							let checked = false;
							if(this.props.value.includes(this.parse(v.value))) {
								checked = true;
							}

							return (
								<div key={k} className="form-check-input">
									<input
										type="checkbox"
										value={v.value}
										name={this.props.formName}
										id={key}
										onChange={(e) => this.onChange(e)}
										checked={checked}
									/>
									<label className="form-check-label" htmlFor={key}>{v.label}</label>
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