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
			loading: false,
			loading_message: '',
			share: false,
			sharings: {
				sharing: false,
				sharing_available: false,
				ip: '',
				os: '',
				use: 0
			}
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
				if(res.data.authorize) {
					window.location.href = res.data.redirect;
				} else {
					if(res.data.share) {
						this.setState({
							share: res.data.share,
							sharings: res.data.sharings
						});
					} else {
						this.setState({login: true});
					}
				}
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

	async use_sharing(e) {
		this.setState({loading: true});
		await axios.post('/api/auth/sharing/use', {
			ip: this.state.sharings.ip,
			os: this.state.sharings.os,
			login_id: this.state.login_id,
			password: this.state.password,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				if(res.data.authorize) {
					window.location.href = res.data.redirect;
				} else {
					this.setState({login: true});
				}
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	application_sharing(e) {
		this.setState({
			share: false,
			sharings: {
				ip: '',
				os: '',
				sharing_available: false,
				use: 0
			}
		})
	}

	onSocialSignin(provider) {
		this.setState({loading: true, message: 'リダイレクト中...'});
		axios.get('/api/auth/social/redirect/' + provider).then((res) => {
			if(res.data.result) {
				window.location.href = res.data.redirect;
			}
		}).catch((e) => {
			console.log(e)
			this.setState({loading: false, message: ''})
		})
	}

	sharing_display()
	{
		if(this.state.sharings.sharing_available) {
			return (
				<div className="card-body">
					<p className="sharing-box-msg">
						下記情報を登録しますか？<br/>
						複数端末ログインは最大3台までです。<br/>
						現在の端末数：{this.state.sharings.use}台
					</p>
					<div className="form-group">
						<label>IP</label>
						<p>{this.state.sharings.ip}</p>
					</div>
					<div className="form-group">
						<label>OS</label>
						<p>{this.state.sharings.os}</p>
					</div>
					<div className="d-flex">
						<button
							className="btn btn-default"
							onClick={(e) => this.application_sharing(e)}
						>
							拒否
						</button>
						<button
							className="btn btn-primary ml-auto"
							onClick={(e) => this.use_sharing(e)}
						>
							登録
						</button>
					</div>
				</div>
			)
		} else {
			return (
				<div className="card-body">
					<p className="sharing-box-msg">
						端末数の上限に達しました。<br/>
						シェア済みの端末でログインを続けるか、シェア済みの端末を削除してください。
					</p>
					<button
						className="btn btn-primary"
					>
						端末削除申請
					</button>
				</div>
			)
		}
	}

	login_display()
	{
		if(!this.state.login) {
			if(this.state.share) {
				return this.sharing_display();
			}
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
					<div className="d-flex mt-2">
						<p className="text-center pointer" onClick={(e) => this.onSocialSignin('google')}>
							<img src="/assets/img/sns/google-social-login.png" alt="Signup for Google" width="300"/>
						</p>
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
					message={this.state.loading_message}
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