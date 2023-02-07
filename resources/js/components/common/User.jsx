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
		this.fetch();
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

	render() {
		return (
			<div className="user-profile">
				<p className="username text-center">ようこそ、{this.state.user.name}さん</p>
			</div>
		)
	}
}

export default User;