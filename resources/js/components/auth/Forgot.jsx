import React from 'react';
import {Link} from 'react-router-dom';

import Loader from '../common/Loader';
import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';
import Error from '../forms/Error';

class Forgot extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			forgot: '',
			identify: '',
			token: '',
			send: false,
			loading: false,
			errors: {
				forgot: []
			}
		}
	}

	handlerChange(name, value) {
		const params = {}
		params[name] = value
		this.setState(params)
	}

	onApp(e) {
		// TODO なんか動かん
		this.setState({loading: true})
		axios.post('/api/auth/forgot', {
			forgot: this.state.forgot,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					forgot: '',
					identify: res.data.identify,
					token: res.data.token,
					send: true
				})
			}
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors});
			}
		}).finally(() => {
			this.setState({loading: false})
		})
	}

	contents() {
		if(this.state.send) {
			return (
				<div>
					<div className="card-body">
						<p className="text-center mb-1">
							パスワードを再発行しました。<br/>
							メールを確認してください。<br/>
							下記リンクまたはメールアドレスのリンクより再設定してください。
						</p>
						<p className="text-center">
							<Link to={`/auth/password/${this.state.identify}/${this.state.token}`} className="btn btn-warning">パスワード再設定へ</Link>
						</p>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					<div className="card-body">
						<Text
						label="LoginId or Email"
						formName="forgot"
						value={this.state.forgot}
						onChange={(name, value) => this.handlerChange(name, value)}
						/>
						<Error error={this.state.errors.forgot} />
						<button className="btn btn-primary" onClick={(e) => this.onApp(e)}>申請</button>
						<p className="mb-0">
							<Link to="/auth/login" className="text-center">Login Page</Link>
						</p>
					</div>
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
						{this.contents()}
					</div>
				</div>
			</div>
		)
	}
}

export default Forgot;