import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import Loader from '../../common/Loader';
import Modal from '../../plugins/Modal';
import Buttons from './parts/Buttons';

import Text from '../../forms/Text'
import Error from '../../forms/Error'

class Favorites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			carts: [],
			favorites: [],
			loading: false,
			f_name: '',
			errors: {
				f_name: []
			},
			modal_options: {
				active: false,
				title: '',
				content: '',
				classes: ['modal-xl'],
				buttons: [],
				success: true,
				closefn: () => {},
				callbackfn: () => {}
			}
		}
	}

	componentDidMount() {
		this.fetch();
	}

	handlerChange(name, value) {
		const params = {};
		params[name] = value;
		this.setState(params);
	}

	async fetch(callback_fn) {
		await axios.get('/api/shop/favorite/favorites', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					products: res.data.products,
					carts: res.data.carts,
					favorites: res.data.favorites
				})
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			if(typeof callback_fn === 'function') {
				callback_fn();
			}
		})
	}

	modalClose() {
		this.setState({
			f_name: '',
			modal_options: {
				active: false,
				title: '',
				content: ''
			}
		})
	}

	async folders(product) {
		this.setState({loading: true})
		const response = await axios.get('/api/shop/favorite/folders', {
			credentials: 'same-origin'
		}).then((res) => {
			return res.data
		}).catch((e) => {
			console.log(e)
			return {result: false}
		}).finally(() => {
			this.setState({loading: false})
		})

		if(response.result) {
			this.setState({
				modal_options: {
					active: true,
					title: 'お気に入りフォルダ',
					content: this.foldersContent(response.folders, product)
				}
			})
		}
	}

	async createFolder() {
		this.setState({loading: true, modal_options: {active: false}})
		const res = await axios.post('/api/shop/favorite/folder/create', {
			name: this.state.f_name,
			credentials: 'same-origin'
		}).then((res) => {
			return res.data
		}).catch((e) => {
			if(e.response.status === 400) {
				this.setState({errors: e.response.data.errors})
				this.modalCreateFolder()
			}
			console.log(e)
			return {result: false}
		})

		if(res.reuslt) {
			this.setState({
				f_name: '',
				modal_options: {
					active: false,
					title: '',
					content: ''
				}
			})
			this.fetch(() => {
				this.setState({loading: false})
			})
		} else {
			this.setState({loading: false})
			this.modalCreateFolder()
		}
	}

	modalCreateFolder(e) {
		this.setState({
			modal_options: {
				active: true,
				title: 'お気に入りフォルダを追加',
				content: this.modalCreateFolderContent(),
				closefn: () => this.modalClose(),
				success: true,
				callbackfn: () => {
					this.createFolder()
				}
			}
		})
	}

	modalCreateFolderContent() {
		return (
			<div>
				<Text
				label="フォルダ名"
				value={this.state.f_name}
				formName="f_name"
				onChange={(name, value) => this.handlerChange(name, value)}
				/>
				<Error error={this.state.errors.f_name}/>
			</div>
		)
	}

	async addFolder(id, product) {
		this.setState({loading: true})
		const res = await axios.post('/api/shop/favorite/folder/' + id, {
			product: product,
			credentials: 'same-origin'
		}).then((res) => {
			return res.data
		}).catch((e) => {
			console.log(e)
			return {result: false}
		}).finally(() => {
			this.setState({
				f_modal: false,
				fm_content: ''
			})
		})

		if(res.result) {
			this.fetch()
		}
		this.setState({loading: false})
	}

	foldersContent(data, product, child) {
		return (
			data.map((folder, k) => {
				return (
					<div
					key={`folder-${k}`}
					className={(typeof child !== 'undefined') ? 'children mb-1 ml-1' : 'master mb-2'}
					>
						<div>
							<button
							className="btn btn-block btn-default"
							onClick={(e) => this.addFolder(folder.id, product)}
							>
								<i className="fas fa-folder-plus"></i>
								{folder.name}
							</button>
						</div>
						{(folder.children) ? this.foldersContent(folder.children, product, true) : ''}
					</div>
				)
			})
		)
	}

	async addCart(e, identify) {
		this.setState({loading: true});
		await axios.post('/api/shop/cart/add/' + identify, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					carts: res.data.products
				})
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	async removeCart(e, identify) {
		this.setState({loading: true});
		await axios.post('/api/shop/cart/remove/' + identify, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					carts: res.data.products
				})
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	async addFavorite(e, identify) {
		this.setState({loading: true});
		await axios.post('/api/shop/favorite/add/' + identify, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({favorites: res.data.favorites});
			}
		}).catch((e) => {
			console.log(e)
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	async removeFavorite(e, identify) {
		this.setState({loading: true});
		await axios.post('/api/shop/favorite/remove/' + identify, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({favorites: res.data.favorites});
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	contents() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<div className="ml-auto">
								<Buttons
								cart={this.state.carts.length}
								favorites={this.state.favorites.length}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header d-flex">
						<button className="btn btn-primary ml-auto" onClick={(e) => this.modalCreateFolder(e)}>追加</button>
					</div>
					<div className="card-body">
						<button className="btn btn-block btn-primary text-left"><i className="fas fa-folder-open"></i>フォルダー1</button>
						<button className="btn btn-block btn-primary text-left"><i className="fas fa-folder-open"></i>フォルダー2</button>
					</div>
				</div>
				<div className="card card-list">
					<Loader is_loading={this.state.loading}/>
					<div className="card-body pb-0">
						<div className="row">
							{this.state.products.map((product, k) => {
								return (
									<div
									key={product.identify_code}
									className="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column"
									>
										<div className="card bg-light d-flex flex-fill">
											<div className="card-header text-muted border-bottom-0 d-flex">
												<div className="p-0 col-10 d-inline-flex align-items-center">出品者：{product.user.name}</div>
												<button
												className="btn btn-default ml-auto col-2"
												onClick={(e) => this.folders(product.identify_code)}
												>
													<i className="fas fa-folder-plus"></i>
												</button>
											</div>
											<div className="card-body pt-0">
												<div className="row">
													<div className="col-7">
														<h2 className="lead">
															<b>{product.name}</b>
														</h2>
														<p className="text-muted text-sm">{product.description}</p>
														<ul className="mb-0 fa-ul text-muted pl-0">
															<li className="small">
																在庫数：{product.inventoly}
															</li>
															<li className="small">
																最速配達日：ご購入日より{product.fasted_delivery_day}日後
															</li>
														</ul>
													</div>
													<div className="col-5 text-center">
														{product.thumbnails.map((thumbnail, t_k) => {
															if(t_k === 0) {
																return (
																	<img key={t_k} src={thumbnail.path} alt={thumbnail.name} className="img-circle-img-fluid" width="100"/>
																)
															}
														})}
													</div>
												</div>
											</div>
											<div className="card-footer">
												<div className="d-flex">
													{(this.state.favorites.includes(product.identify_code)) ?
														<button
														className="btn btn-danger"
														onClick={(e) => this.removeFavorite(e, product.identify_code)}
														>
															<i className="fas fa-heart"></i>
														</button>
													:
														<button
														className="btn btn-outline-danger"
														onClick={(e) => this.addFavorite(e, product.identify_code)}
														>
															<i className="fas fa-heart"></i>
														</button>
													}
													{(this.state.carts.includes(product.identify_code)) ?
														<button
														className="btn btn-default ml-1"
														onClick={(e) => this.removeCart(e, product.identify_code)}
														>
															Rmove <i className="fas fa-shopping-cart"></i>
														</button>
													:
														<button
														className="btn btn-default ml-1"
														onClick={(e) => this.addCart(e, product.identify_code)}
														>
															Add <i className="fas fa-shopping-cart"></i>
														</button>
													}
													<Link to={`/ec/product/${product.identify_code}`} className="btn btn-primary ml-auto">View</Link>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				<Modal
				title={this.state.modal_options.title}
				active={this.state.modal_options.active}
				content={this.state.modal_options.content}
				classes={this.state.modal_options.classes}
				closefn={this.state.modal_options.closefn}
				success={this.state.modal_options.success}
				callbackfn={this.state.modal_options.callbackfn}
				/>
			</div>
		)
	}

	render() {
		return (<Base title="お気に入り" content={this.contents()}/>)
	}
}

export default Favorites;