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
		// デフォルトオプション
		this.config = {
			modals: {
				folder_create: {
					active: false,
					title: 'お気に入りフォルダ追加',
					classes: ['modal-xl'],
					success: true,
					closefn: () => {},
					callbackfn: () => {}
				},
				folder_add: {
					active: false,
					title: 'フォルダに追加',
					classes: ['modal-xl'],
					success: false,
					closefn: () => {},
					callbackfn: () => {}
				}
			}
		}

		this.state = {
			products: [],
			carts: [],
			favorites: [],
			folders: [],
			folder: null,
			current_folder: '',
			loading: false,
			f_name: '',
			errors: {
				f_name: []
			},
			folder_create: {
				active: this.config.modals.folder_create.active,
				title: this.config.modals.folder_create.title,
				classes: this.config.modals.folder_create.classes,
				success: this.config.modals.folder_create.success,
				closefn: () => this.config.modals.folder_create.closefn,
				callbackfn: () => this.config.modals.folder_create.callbackfn
			},
			folder_add: {
				folders: [],
				product: null,
				active: this.config.modals.folder_add.active,
				title: this.config.modals.folder_add.title,
				classes: this.config.modals.folder_add.classes,
				success: this.config.modals.folder_add.success,
				closefn: () => this.config.modals.folder_add.closefn,
				callbackfn: () => this.config.modals.folder_add.callbackfn
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
			params: {
				folder: this.state.folder
			},
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					products: res.data.products,
					carts: res.data.carts,
					favorites: res.data.favorites,
					folders: res.data.folders
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

	async viewFolder(id) {
		await this.setState({
			loading: true,
			folder: id
		})
		this.fetch(() => {
			this.setState({loading: false})
		})
	}

	async backFolder() {
		await this.setState({loading: true})
		const res = await Utils.apiHandler('get', '/api/shop/favorite/folder/back', {
			params: {
				folder: this.state.folder
			},
			credentials: 'same-origin'
		}).then((res) => {
			return res.data;
		}).catch((e) => {
			return {result: false}
		})

		if(res.result) {
			await this.setState({folder: res.parent_id})
			this.fetch(() => {
				this.setState({loading: false})
			})
		} else {
			this.setState({loading: false})
		}
	}

	async trashFolder(id) {
		this.setState({loading: true})
		await Utils.apiHandler('post', '/api/shop/favorite/folder/destroy/' + id, {
			credentials: 'same-origin'
		}, () => {
			this.fetch(() => {
				this.setState({loading: false})
			})
		}).then(() => {}).catch((e) => {
			console.log(e)
		})
	}

	async createFolder() {
		await this.setState({
			loading: true,
			folder_create: Object.assign(this.config.modals.folder_create, {
				active: false
			})
		})
		const res = await axios.post('/api/shop/favorite/folder/create', {
			f_name: this.state.f_name,
			parent: this.state.folder,
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

		if(res.result) {
			await this.setState({
				f_name: '',
				folder_create: Object.assign(this.config.modals.folder_create, {active: false}),
				errors: {
					f_name: []
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

	modalCloseCreateFolder() {
		this.setState({
			f_name: '',
			folder_create: Object.assign(this.config.modals.folder_create, {active: false})
		})
	}

	modalCreateFolder(e) {
		this.setState({
			folder_create: Object.assign(this.config.modals.folder_create, {
				active: true,
				closefn: () => this.modalCloseCreateFolder(),
				callbackfn: () => this.createFolder()
			})
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
				folder_add: Object.assign(this.config.modals.folder_add, {
					active: true,
					folders: response.folders,
					product: product,
					closefn: () => this.modalCloseFolders()
				})
			})
		}
	}

	async addFolder(id, product) {
		this.setState({loading: true})
		const res = await axios.post('/api/shop/favorite/folder/add/' + id, {
			product: product,
			credentials: 'same-origin'
		}).then((res) => {
			return res.data
		}).catch((e) => {
			console.log(e)
			return {result: false}
		}).finally(() => {
			this.setState({loading: false})
		})

		if(res.result) {
			this.setState({
				folder_add: Object.assign(this.config.modals.folder_add, {
					active: false,
					folders: [],
					product: null
				})
			})
			this.fetch()
		}
	}

	modalCloseFolders() {
		this.setState({
			folder_add: Object.assign(this.config.modals.folder_add, {
				active: false,
				product: null,
				folders: []
			})
		})
	}

	foldersContent(data, product, child) {
		return (
			data.map((folder, k) => {
				return (
					<div
					key={`folder-${k}`}
					className={(typeof child !== 'undefined') ? 'children mb-1 ml-4' : 'master mb-2'}
					>
						<div className="mb-1">
							<button
							className="btn btn-block btn-default text-left"
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
						<div className="col-6">
							{this.state.current_folder}
						</div>
						<button className="btn btn-primary ml-auto" onClick={(e) => this.modalCreateFolder(e)}>フォルダ追加</button>
					</div>
					<div className="card-body">
						{this.state.folder ?
						<button
						className="btn btn-default mb-1"
						onClick={(e) => this.backFolder()}
						>
							戻る
						</button>
						: ''}
						{this.state.folders.length ?
						this.state.folders.map((folder, k) => {
							return (
								<div className="d-flex mb-1" key={`folder-${k}`}>
									<button
									className="btn btn-default mr-1"
									>
										<i className="fas fa-sort"></i>
									</button>
									<button
									className="btn btn-block btn-primary text-left mr-1"
									onClick={(e) => this.viewFolder(folder.id)}
									>
										<i className="fas fa-folder-open"></i>
										{folder.name}
									</button>
									<button
									className="btn btn-danger ml-auto"
									onClick={(e) => this.trashFolder(folder.id)}
									>
										<i className="fa fa-trash"></i>
									</button>
								</div>
							)
						})
						: ''}
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
				title={this.state.folder_create.title}
				active={this.state.folder_create.active}
				classes={this.state.folder_create.classes}
				closefn={this.state.folder_create.closefn}
				success={this.state.folder_create.success}
				callbackfn={this.state.folder_create.callbackfn}
				>
					{this.modalCreateFolderContent()}
				</Modal>

				<Modal
				title={this.state.folder_add.title}
				active={this.state.folder_add.active}
				classes={this.state.folder_add.classes}
				closefn={this.state.folder_add.closefn}
				success={this.state.folder_add.success}
				callbackfn={this.state.folder_add.callbackfn}
				>
					{this.foldersContent(this.state.folder_add.folders, this.state.folder_add.product)}
				</Modal>
			</div>
		)
	}

	render() {
		return (<Base title="お気に入り" content={this.contents()}/>)
	}
}

export default Favorites;