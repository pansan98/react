import React from 'react';
import {Link} from 'react-router-dom';

import Loader from '../common/Loader';
import Text from '../forms/Text';

class Authorize extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			authorize: false,
			loading: false
		}
	}

	handerChange(name, value) {
		const params = {};
		params[name] = value;
		this.setState(params);
	}

	onAuthorize(e) {
		this.setState({loading: true});
		axios.post('/api/auth/authorize/' + this.props.identify + '/' + this.props.token, {
			code: this.state.code,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({authorize: res.data.authorize});
				if(!res.data.authorize) {
					window.alert('認証に失敗しました。');
				}
			}
		}).catch((e) => {
			console.log(e)
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	contents() {
		if(!this.state.authorize) {
			return (
				<div className="card">
					<div className="card-body">
						<Text
						label="認証コード"
						value={this.state.code}
						formName="code"
						onChange={(name, value) => this.handerChange(name, value)}
						/>
					</div>
					<button className="btn btn-primary" onClick={(e) => this.onAuthorize(e)}>認証</button>
				</div>
			)
		} else {
			return (
				<div className="card">
					<div className="card-body">
						<p className="text-center">認証しました。</p>
						<p className="mb-0">
							<Link className="text-center" to="/">Home</Link>
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
					{this.contents()}
				</div>
			</div>
		)
	}
}

Authorize.defaultProps = {
	identify: '',
	token: ''
}

export default Authorize;