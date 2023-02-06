import React from 'react';
import {Link} from 'react-router-dom';
import Auth from '../plugins/Auth';

import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';


class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login_id: '',
			password: ''
		}
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	onSubmit(e)
	{
		e.preventDefault();
		console.log(this.state);
	}

	render() {
		return (
			<div className="login-box">
				<PageLoader />
				<div className="card">
					<div className="card-body">
						<p className="login-box-msg">Sign in to start sessions</p>
						<form>
							<Text
								formName="login_id"
								type="text"
								label="Login ID"
								value={this.state.login_id}
								onChange={(name, value) => this.handlerChange(name, value)}
							/>
							<Text
								formName="password"
								type="password"
								label="Password"
								value={this.state.password}
								onChange={(name, value) => this.handlerChange(name, value)}
							/>
							<div className="col-4">
								<button type="submit" className="btn btn-primary btn-block" onSubmit={(e) => this.onSubmit(e)}>Sign in</button>
							</div>
						</form>
						<p className="mb-0">
							<Link className="text-center" to="/auth/register">Register</Link>
						</p>
					</div>
				</div>
			</div>
		)
	}
}

export default Login;