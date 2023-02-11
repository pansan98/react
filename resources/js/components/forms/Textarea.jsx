import React from 'react';

class Textarea extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<label>{this.props.label}</label>
				<textarea
					className="form-control"
					rows={this.props.row}
					value={this.props.value}
					onChange={(e) => this.props.onChange(this.props.formName, e.currentTarget.value)}
				>
				</textarea>
			</div>
		)
	}
}

Textarea.defaultProps = {
	label: '',
	value: '',
	row: 3
}

export default Textarea;