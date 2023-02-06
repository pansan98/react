import React from 'react';

class Error extends React.Component {
	constructor(props) {
		super(props)
	}

	error_display()
	{
		if(typeof this.props.error === 'Array') {
			{this.props.error.map((v, i) => {
				return (
					<p className="error" key={i}>{v}</p>
				)
			})}
		} else {
			return (<p className="error">{this.props.error}</p>)
		}
	}

	render() {
		return (
			<div className="error-box">
				{this.error_display()}
			</div>
		)
	}
}

export default Error;