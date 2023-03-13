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
							<i className="nav-icon far fa-clock"></i>
							<p>Stop Watch</p>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/shop" className="nav-link">
							<i className="nav-icon fas fa-shopping-cart"></i>
							<p>Shop Dashboard</p>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/ec" className="nav-link">
							<i className="nav-icon fas fa-store-alt"></i>
							<p>EC</p>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/event" className="nav-link">
							<i className="nav-icon fas fa-calendar-week"></i>
							<p>Event Dashboard</p>
						</Link>
					</li>
				</ul>
			</nav>
		)
	}
}

export default SideMenuNav;