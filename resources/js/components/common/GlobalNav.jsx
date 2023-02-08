import React from 'react';
import {Link} from 'react-router-dom';

const GlobalNav = () => {
	return (
		<nav className="main-header navbar navbar-expand navbar-white navbar-light">
			<ul className="navbar-nav">
				<li className="nav-item d-none d-sm-inline-block">
					<Link to="/">Home</Link>
				</li>
				<li className="ml-2 nav-item d-none d-sm-inline-block">
					<Link to="/contact">Contact</Link>
				</li>
				<li className="ml-2 nav-item d-none d-sm-inline-block">
					<Link to="/practice/stop-watch">StopWatch</Link>
				</li>
			</ul>
		</nav>
	);
}

export default GlobalNav;