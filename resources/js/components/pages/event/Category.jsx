import React from 'react'
import {Link} from 'react-router-dom'

import Modal from '../../plugins/Modal'

import Base from '../Base'
import Text from '../../forms/Text'
import Error from '../../forms/Error'

class Category extends React.Component {
	constructor(props) {
		super(props)

		this.config = {
			modals: {
				create: {
					active: false,
					title: '作成',
					classes: ['modal-lg'],
					success: true,
					closefn: () => {},
					callbackfn: () => {}
				}
			}
		}

		this.state = {
			categories: [],
			category: '',
			errors: {
				category: []
			},
			modal_create: {
				active: this.config.modals.create.active,
				title: this.config.modals.create.title,
				classes: this.config.modals.create.classes,
				success: this.config.modals.create.success,
				closefn: this.config.modals.create.closefn,
				callbackfn: this.config.modals.create.callbackfn
			}
		}
	}

	componentDidMount() {
		this.fetch()
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	async fetch() {
		await axios.get('/api/event/category', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({categories: res.data.categories})
			}
		}).catch((e) => {
			console.log(e)
		})
	}

	closeCreateModal() {
		this.setState({
			modal_create: Object.assign(this.config.modals.create, {
				active: false
			})
		})
	}

	async saveCreateModal() {
		this.closeCreateModal()
		this.setState({loading: true})
		const res = await Utils.apiHandler('post', '/api/event/category/create', {
			category: this.state.category
		}, () => {
			this.setState({loading: false})
		}).then((res) => {
			return res.data
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors})
				this.viewCreateModal()
			}
			return {result: false}
		})

		if(res.result) {
			this.fetch()
			this.setState({category: ''})
		}
	}

	viewCreateModal(e) {
		this.setState({
			modal_create: Object.assign(this.config.modals.create, {
				active: true,
				closefn: () => this.closeCreateModal(),
				callbackfn: () => this.saveCreateModal()
			})
		})
	}

	create_content() {
		return (
			<div>
				<Text
				label="名前"
				formName="category"
				value={this.state.category}
				onChange={(name, value) => this.handlerChange(name, value)}
				/>
				<Error error={this.state.errors.category}/>
			</div>
		)
	}

	contents() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<Link to="/event" className="btn btn-default">戻る</Link>
							<button
							className="btn btn-primary ml-auto"
							onClick={(e) => this.viewCreateModal()}
							>
								追加
							</button>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">My Event Categories</h3>
					</div>
					<div className="card-body">
						<table className="table table-striped projects">
							<thead>
								<tr>
									<th>名前</th>
									<th className="text-center">操作</th>
								</tr>
							</thead>
							<tbody>
								{this.state.categories.map((category, k) => {
									return (
										<tr key={`category-${k}`}>
											<td>{category.name}</td>
											<td className="text-center">
												<button className="btn btn-primary">編集</button>
												<button className="btn btn-danger ml-1"><i className="fa fa-trash"></i></button>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>

				<Modal
				active={this.state.modal_create.active}
				title={this.state.modal_create.title}
				classes={this.state.modal_create.classes}
				success={this.state.modal_create.success}
				closefn={this.state.modal_create.closefn}
				callbackfn={this.state.modal_create.callbackfn}
				>
					{this.create_content()}
				</Modal>
			</div>
		)
	}

	render() {
		return (<Base title="イベントカテゴリ" content={this.contents()} loading={this.state.loading}/>)
	}
}

export default Category