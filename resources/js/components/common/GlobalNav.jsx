import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

class GlobalNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false
		}
	}

	async onLogout(e) {
		this.setState({loading: true});
		await axios.post('/api/auth/logout', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				window.location.href = '/auth/login';
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	render() {
		return (
			<nav className="main-header navbar navbar-expand navbar-white navbar-light">
				<Loader
					is_loading={this.state.loading}
				/>
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
				<ul className="navbar-nav ml-auto">
					<li className="nav-item">
						<button
							className="nav-link btn btn-default"
							onClick={(e) => this.onLogout(e)}
						>
							<i className="fas fa-sign-out-alt"></i>
						</button>
					</li>
				</ul>
			</nav>
		)
	}
}

export default GlobalNav;