import React, {useState} from 'react';
import Auth from '../plugins/Auth';

import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';

class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="login-box">
				<PageLoader />
				<div className="card">
					<div className="card-body">
						<p className="login-box-msg">Sign in to start sessions</p>
						<form>
							<Text formName="login_id" label="ID" value=""/>
							<Text formName="password" label="Password" value=""/>
							<div className="col-4">
								<button type="submit" className="btn btn-primary btn-block">Sign in</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default Login;