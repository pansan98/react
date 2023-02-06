import React from 'react';
import {Link} from 'react-router-dom';

import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';

class Register extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			login_id: '',
			password: '',
			password_confirmation: '',
			email: ''
		}
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	onSave(e)
	{
		e.preventDefault();
		console.log(this.state);
	}

	render()
	{
		return (
			<div className="login-box">
				<PageLoader />
				<div className="card">
					<div className="card-body">
						<p className="login-box-msg">Sign in to start sessions</p>
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
						<Text
							formName="password_confirmation"
							type="password"
							label="Password ReTry"
							value={this.state.password_confirmation}
							onChange={(name, value) => this.handlerChange(name, value)}
						/>
						<Text
							formName="email"
							type="email"
							label="Email"
							value={this.state.email}
							onChange={(name, value) => this.handlerChange(name, value)}
						/>
						<div className="col-4">
							<button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.onSave(e)}>Sign in</button>
						</div>
						<p className="mb-0">
							<Link to="/auth/login" className="text-center">Login</Link>
						</p>
					</div>
				</div>
			</div>
		)
	}
}

export default Register;