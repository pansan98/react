import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import Loader from '../../common/Loader';

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
			f_profession: '',
			f_gender: 0,
			f_thumbnail: [],
			profile: {
				path: '/assets/img/no-image.jpg'
			},
			errors: {
				name: [],
				email: [],
				thumbnail: []
			},
			forms: {
				gender: []
			},
			loading: false
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
				f_email: this.props.user.email,
				f_profession: this.props.user.profession,
				f_gender: this.props.user.gender
			});
		}

		this.fetch_label('gender');
	}

	async fetch_label(label)
	{
		await axios.get('/api/auth/user/labels', {
			credentials: 'same-origin',
			params: {
				label: label
			}
		}).then((res) => {
			if(res.data.result) {
				const labels = [];
				for(let k in res.data.labels) {
					labels.push({
						label: res.data.labels[k],
						value: k
					})
				}
				this.setState({forms: {
					gender: labels,
				}})
			}
		}).catch((e) => {
			console.log(e);
		})
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
					f_email: res.data.user.email,
					f_profession: res.data.user.profession,
					f_gender: res.data.user.gender
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

	async save(e) {
		this.setState({loading: true});
		await axios.post('/api/auth/profile', {
			name: this.state.f_name,
			email: this.state.f_email,
			profession: this.state.f_profession,
			gender: this.state.f_gender,
			thumbnail: this.state.f_thumbnail,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					f_thumbnail: [],
					user: {
						thumbnail: {
							path: res.data.path
						}
					}
				})
				window.alert('更新しました。');
			}
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors});
			}
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	async clear(e) {
		if(this.state.user.thumbnail) {
			this.setState({loading: true});
			await axios.post('/api/auth/profile/thumbnail/destroy', {
				credentials: 'same-origin'
			}).then((res) => {
				if(res.data.result) {
					this.setState({user: {
						thumbnail: null
					}})
				}
			}).catch((e) => {
				console.log(e);
			}).finally(() => {
				this.setState({loading: false})
			})
		}
	}

	contents() {
		let clear_disabled = '';
		if(!this.state.user.thumbnail) {
			clear_disabled = ' disabled';
		}
		return (
			<div className="row">
				<Loader
					is_loading={this.state.loading}
				/>
				<div className="col-md-3">
					<div className="card card-primary card-outline">
						<div className="card-body box-profile">
							<div className="text-center">
								<img src={(this.state.user.thumbnail) ? this.state.user.thumbnail.path : '/assets/img/no-image.jpg'} className="profile-user-img img-fluid img-circle"/>
								<div className="offset-sm-1 col-sm-10 mt-2">
									<button className={`btn btn-danger${clear_disabled}`} onClick={(e) => this.clear(e)}>Clear</button>
								</div>
							</div>
							<h3 className="text-center">{this.state.f_name}</h3>
							<p className="text-muted text-center">{this.state.f_profession}</p>
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
										value={(this.state.f_email) ? this.state.f_email : ''}
										type="email"
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Error
										error={this.state.errors.email}
									/>
									<Text
										label="職業"
										formName="f_profession"
										value={(this.state.f_profession) ? this.state.f_profession : ''}
										type="text"
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Radio
										label="性別"
										formName="f_gender"
										value={this.state.f_gender}
										values={this.state.forms.gender}
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Uploader
										label="画像"
										formName="f_thumbnail"
										value={this.state.f_thumbnail}
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Error error={this.state.errors.thumbnail}/>
								</div>
								<button className="btn btn-primary" onClick={(e) => this.save(e)}>保存</button>
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