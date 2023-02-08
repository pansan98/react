import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';

import Text from '../../forms/Text';
import Radio from '../../forms/Radio';
import Uploader from '../../forms/Uploader';
import Error from '../../forms/Error';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {},
			f_name: '',
			f_email: '',
			errors: {
				name: [],
				email: [],
				thumbnail: []
			}
		}
	}

	componentDidMount()
	{
		if(!this.props.user) {
			this.fetch();
		} else {
			this.setState({
				user: this.props.user,
				f_name: this.props.user.name,
				f_email: this.props.user.email
			});
		}
	}

	async fetch()
	{
		await axios.get('/api/auth/user', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					user: res.data.user,
					f_name: res.data.user.name,
					f_email: res.data.user.email
				})
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	contents() {
		return (
			<div className="row">
				<div className="col-md-3">
					<div className="card card-primary card-outline">
						<div className="card-body box-profile">
							<div className="text-center">
								<img src="/assets/img/no-image.jpg" className="profile-user-img img-fluid img-circle"/>
								<div className="offset-sm-1 col-sm-10 mt-2">
									<button className="btn btn-danger">Clear</button>
								</div>
							</div>
							<h3>{this.state.user.name}</h3>
							<p className="text-muted text-center">職業</p>
						</div>
					</div>
				</div>
				<div className="col-md-9">
					<div className="card">
						<div className="card-header p-2">
							<ul className="nav nav-pills">
								<li className="nav-item">
									<Link to="javascript: void(0);" className="nav-link">MyProfile</Link>
								</li>
							</ul>
						</div>
						<div className="card-body">
							<div className="tab-content">
								<div className="active tab-pane">
									<Text
										label="名前"
										formName="f_name"
										value={this.state.f_name}
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Error
										error={this.state.errors.name}
									/>
									<Text
										label="Email"
										formName="f_email"
										value={this.state.f_email}
										type="email"
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Error
										error={this.state.errors.email}
									/>
									<Uploader />
									<Error error={this.state.errors.thumbnail}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Base title="Profile" content={this.contents()} />
		)
	}
}

export default Profile;