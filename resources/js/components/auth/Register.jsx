import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';
import Error from '../forms/Error';

class Register extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			name: '',
			login_id: '',
			password: '',
			password_confirmation: '',
			email: '',
			errors: {
				name: [],
				login_id: [],
				password: [],
				password_confirmation: [],
				email: []
			},
			registered: false
		}
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	async onSave(e)
	{
		e.preventDefault();
		await axios.post('/api/auth/register', {
			name: this.state.name,
			login_id: this.state.login_id,
			password: this.state.password,
			password_confirmation: this.state.password_confirmation,
			email: this.state.email,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({registered: true});
			}
			return;
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors});
			}
		})
	}

	register_display()
	{
		if(!this.state.registered) {
			return (
				<div className="card-body">
					<p className="login-box-msg">Sign in to start sessions</p>
					<Text
						formName="name"
						type="text"
						label="Nick Name"
						value={this.state.name}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.name}
					/>
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
					<Text
						formName="password_confirmation"
						type="password"
						label="Password ReTry"
						value={this.state.password_confirmation}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.password_confirmation}
					/>
					<Text
						formName="email"
						type="email"
						label="Email"
						value={this.state.email}
						onChange={(name, value) => this.handlerChange(name, value)}
					/>
					<Error
						error={this.state.errors.email}
					/>
					<div className="col-4">
						<button type="submit" className="btn btn-primary btn-block" onClick={(e) => this.onSave(e)}>Sign in</button>
					</div>
					<p className="mb-0">
						<Link to="/auth/login" className="text-center">Login</Link>
					</p>
				</div>
			)
		} else {
			return (
				<div className="card-body">
					<p className="text-center">登録が完了しました。<br/>ログインページでログインしてください。</p>
					<p className="mb-0">
						<Link to="/auth/login" className="text-center">Login</Link>
					</p>
				</div>
			)
		}
	}

	render()
	{
		return (
			<div className="register-page">
				<div className="register-box">
					<PageLoader />
					<div className="card">
						{this.register_display()}
					</div>
				</div>
			</div>
		)
	}
}

export default Register;