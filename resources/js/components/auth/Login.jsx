import React from 'react';
import {Link} from 'react-router-dom';

import Loader from '../common/Loader';
import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';
import Error from '../forms/Error';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login_id: '',
			password: '',
			errors: {
				login_id: [],
				password: [],
				login_error: []
			},
			login: false,
			loading: false
		}
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	async onLogin(e)
	{
		e.preventDefault();
		this.setState({loading: true});
		await axios.post('/api/auth/login', {
			login_id: this.state.login_id,
			password: this.state.password,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({login: true});
			}
			return;
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors});
			}
		}).finally(() => {
			this.setState({loading: false})
		})
	}

	login_display()
	{
		if(!this.state.login) {
			return (
				<div className="card-body">
					<Error
						error={this.state.errors.login_error}
					/>
					<p className="login-box-msg">Sign in to start sessions</p>
					<Text
						formName="login_id"
						type="text"
						label="Login ID"
						value={this.state.login_id}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.login_id}
					/>
					<Text
						formName="password"
						type="password"
						label="Password"
						value={this.state.password}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.password}
					/>
					<div className="col-4">
						<button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.onLogin(e)}>Sign in</button>
					</div>
					<p className="mb-0">
						<Link className="text-center" to="/auth/register">Register</Link>
					</p>
				</div>
			)
		} else {
			return (
				<div className="card-body">
					<p className="text-center">ログインしました。</p>
					<p className="mb-0">
						<Link className="text-center" to="/">Home</Link>
					</p>
				</div>
			)
		}
	}

	render() {
		return (
			<div className="login-page">
				<Loader
					is_loading={this.state.loading}
				/>
				<div className="login-box">
					<PageLoader />
					<div className="card">
						{this.login_display()}
					</div>
				</div>
			</div>
		)
	}
}

export default Login;