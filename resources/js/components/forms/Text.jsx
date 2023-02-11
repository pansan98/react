import React from 'react';

class Text extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="form-group">
				<label>{this.props.label}</label>
				<input
					type={this.props.type}
					className="form-control"
					name={this.props.formName}
					value={this.props.value}
					placeholder={this.props.placeholder}
					readOnly={this.props.readOnly}
					onChange={(e) => this.props.onChange(this.props.formName, e.currentTarget.value)}
				/>
			</div>
		)
	}
}

Text.defaultProps = {
	type: 'text',
	placeholder: '',
	readOnly: false
}

export default Text;