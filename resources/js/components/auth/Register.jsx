import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
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
			}
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
			email: this.state.email
		}).then((res) => {
			if(res.data.result) {
				window.alert('登録しました。');
				// TODO 登録完了後にリダイレクトができない(最悪location使うか？)
				// const navigate = new useNavigate();
				// navigate('/auth/login');
			}
			return;
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors});
			}
		})
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
				</div>
			</div>
		)
	}
}

export default Register;