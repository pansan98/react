import React from 'react';
import {Link} from 'react-router-dom';

import Loader from '../common/Loader';
import PageLoader from '../common/PageLoader';
import Text from '../forms/Text';

class Password extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            code: '',
            authorize: false,
            loading: false,
            errors: {
                code: []
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
        axios.post('/api/auth/password/' + this.props.identify + '/' + this.props.token, {
            code: this.state.code,
            credentials: 'same-origin'
        }).then((res) => {
            if(res.data.result) {
                this.setState({authorize: true})
            }
        }).catch((e) => {
            if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors})
			}
        }).finally(() => {
            this.setState({loading: false})
        })
    }

    contents() {
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