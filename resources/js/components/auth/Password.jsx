import React from 'react';
import {Link} from 'react-router-dom';

import Loader from '../common/Loader';
import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';
import Error from '../forms/Error';

class Password extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			code: '',
			password: '',
			token: '',
			authorize: false,
			done: false,
			loading: false,
			errors: {
				code: [],
				password: []
			}
		}
	}

	handlerChange(name, value) {
		const params = {}
		params[name] = value
		this.setState(params)
	}

	onAuthorize(e) {
		this.setState({loading: true})
		axios.post('/api/auth/password/authorize/' + this.props.identify + '/' + this.props.token, {
			code: this.state.code,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					authorize: true,
					token: res.data.token,
					code: res.data.code
				})
			}
		}).catch((e) => {
			if(e.response.status === 400) {
				if(e.response.data.errors) {
					this.setState({errors: e.response.data.errors})
				}
			}
		}).finally(() => {
			this.setState({loading: false})
		})
	}

	onReset(e) {
		this.setState({loading: true})
		axios.post('/api/auth/password/reset/' + this.props.identify + '/' + this.state.token, {
			token: this.state.token,
			code: this.state.code,
			password: this.state.password,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({done: true})
			}
		}).catch((e) => {
			if(e.response.status === 400) {
				if(e.response.data.errors) {
					this.setState({errors: e.response.data.errors})
				}
			}
		}).finally(() => {
			this.setState({loading: false})
		})
	}

	contents() {
		if(this.state.authorize) {
			if(this.state.done) {
				return (
					<div>
						<div className="card-body">
							<p>パスワードの再設定が完了しました。<br/>ログインしてみてください。</p>
							<Link to="/auth/login" className="btn btn-danger">ログインページ</Link>
						</div>
					</div>
				)
			} else {
				return (
					<div>
						<div className="card-body">
							<p>認証に成功しました。<br/>ページを移動したり更新したりしないでください。<br/>最初からやり直す必要があります。</p>
						</div>
						<div className="card-body">
							<Text
							label="新しいパスワード"
							type="password"
							value={this.state.password}
							formName="password"
							onChange={(name, value) => this.handlerChange(name, value)}
							/>
							<Error error={this.state.errors.password}/>
							<button className="btn btn-primary" onClick={(e) => this.onReset(e)}>設定</button>
						</div>
					</div>
				)
			}
		} else {
			return (
				<div>
					<div className="card-body">
						<Text
						label="認証コード"
						value={this.state.code}
						formName="code"
						onChange={(name, value) => this.handlerChange(name, value)}
						/>
						<button className="btn btn-primary" onClick={(e) => this.onAuthorize(e)}>認証</button>
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

Password.defaultProps = {
	identify: '',
	token: ''
}

export default Password;