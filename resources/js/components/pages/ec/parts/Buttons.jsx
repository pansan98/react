import React from 'react';
import {Link} from 'react-router-dom';

class Buttons extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Link to="/ec/cart" className="btn btn-default"><i className="fas fa-shopping-cart"></i> {this.props.cart}</Link>
				<Link to="/ec/favorites" className="btn btn-outline-danger ml-1"><i className="fas fa-heart"></i> {this.props.favorites}</Link>
			</div>
		)
	}
}

Buttons.defaultProps = {
	cart: 0,
	favorites: 0
}

export default Buttons;