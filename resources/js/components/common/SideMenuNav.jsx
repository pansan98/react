import React from 'react';
import {Link} from 'react-router-dom';

class SideMenuNav extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<nav className="mt-2">
				<ul className="nav nav-pills nav-sidebar flex-column">
					<li className="nav-item">
						<Link to="/contact" className="nav-link">
							<i className="nav-icon far fa-image"></i>
							<p>Contact</p>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/practice/stop-watch" className="nav-link">
							<i className="nav-icon far fa-image"></i>
							<p>Stop Watch</p>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/shop" className="nav-link">
							<i className="nav-icon far fa-shopping-cart"></i>
							<p>Shop</p>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/ec" className="nav-link">
							<i className="nav-icon far fa-image"></i>
							<p>EC</p>
						</Link>
					</li>
				</ul>
			</nav>
		)
	}
}

export default SideMenuNav;