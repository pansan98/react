import React from 'react';
import axios from 'axios';

class User extends React.Component {
	constructor(props)
	{
		super(props);
		this.state = {
			user: {}
		}
	}

	componentWillMount()
	{
		if(!this.props.user) {
			this.fetch();
		} else {
			this.setState({user: this.props.user});
		}
	}

	async fetch()
	{
		await axios.get('/api/auth/user', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({user: res.data.user})
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	display()
	{
		if(this.props.type === 'side-menu') {
			return (
				<div className="user-panel mt-3 pb-3 mb-3 d-flex">
					<div className="info">
						{this.state.user.name}
					</div>
				</div>
			)
		} else {
			return (
				<div className="user-profile">
					<p className="username text-center">ようこそ、{this.state.user.name}さん</p>
				</div>
			)
		}
	}

	render() {
		return (
			<div>{this.display()}</div>
		)
	}
}

export default User;