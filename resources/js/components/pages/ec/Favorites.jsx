import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import Loader from '../../common/Loader';
import Buttons from './parts/Buttons';

class Favorites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			carts: [],
			favorites: [],
			loading: false
		}
	}

	componentDidMount() {
		this.fetch();
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
											<div className="card-header text-muted border-bottom-0">
												出品者：{product.user.name}
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
			</div>
		)
	}

	render() {
		return (<Base title="お気に入り" content={this.contents()}/>)
	}
}

export default Favorites;