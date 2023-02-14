import React from 'react';
import {Link} from 'react-router-dom';
import {Slider, Slide, ButtonBack, ButtonNext, CarouselProvider} from 'pure-react-carousel';

import Base from '../Base';
import SliderStyle from '../../../../sass/plugins/Slider';

class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			cart: {
				products: []
			},
			favorites: []
		}
	}

	componentDidMount() {
		this.fetch();
	}

	async fetch() {
		await axios.get('/api/shop/ec/product/' + this.props.code, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					product: res.data.product,
					cart: {
						products: res.data.cart.products
					},
					favorites: res.data.favorites
				})
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	async addCart(e, identify) {
		this.setState({loading: true});
		await axios.post('/api/shop/cart/add/' + identify, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({
					cart: {
						products: res.data.products
					}
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
					cart: {
						products: res.data.products
					}
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
		if(this.state.product) {
			return (
				<div className="card card-solid">
					<div className="card-body">
						<div className="d-flex">
							<Link to="/ec" className="btn btn-default">戻る</Link>
						</div>
					</div>
					<div className="card-body">
						<div className="row">
							<div className="col-12 col-sm-6">
								<h3 className="d-inline-block d-sm-none">{this.state.product.name}</h3>
								<div className="col-12">
									{(this.state.product.thumbnails) ?
									<CarouselProvider
									naturalSlideWidth={0}
									naturalSlideHeight={0}
									totalSlides={this.state.product.thumbnails.length}
									>
										<Slider className={SliderStyle.slider}>
											{this.state.product.thumbnails.map((thumbnail, k) => {
												return (
													<Slide key={k} index={k}>
														<img src={thumbnail.path} alt={thumbnail.name} width="450"/>
													</Slide>
												)
											})}
										</Slider>
										<ButtonBack className="btn btn-default">Back</ButtonBack>
										<ButtonNext className="btn btn-default ml-auto">Next</ButtonNext>
									</CarouselProvider>
									: ''}
								</div>
							</div>
							<div className="col-12 col-sm-6">
								<h3 className="my-3">{this.state.product.name}</h3>
								<p>{this.state.product.description}</p>
								<hr/>
								<div className="bg-gray py-2 px-3 mt-4">
									<h2 className="mb-0">{(this.state.product.price) ? new Intl.NumberFormat('ja-JP').format(this.state.product.price) + '円' : ''}</h2>
									<h4 className="mt-0">
										<small>{(this.state.product.price) ? new Intl.NumberFormat('ja-JP').format((this.state.product.price + (this.state.product.price * 0.1))) + '円(税込)' : ''}</small>
									</h4>
								</div>
								<div className="mt-4">
									{(this.state.cart.products.includes(this.state.product.identify_code)) ?
										<button
										className="btn btn-default ml-1"
										onClick={(e) => this.removeCart(e, this.state.product.identify_code)}
										>
											Remove <i className="fas fa-shopping-cart"></i>
										</button>
									:
										<button
										className="btn btn-default ml-1"
										onClick={(e) => this.addCart(e, this.state.product.identify_code)}
										>
											Add <i className="fas fa-shopping-cart"></i>
										</button>
									}
									{(this.state.favorites.includes(this.state.product.identify_code)) ?
										<button
										className="btn btn-danger ml-1"
										onClick={(e) => this.removeFavorite(e, this.state.product.identify_code)}
										>
											<i className="fas fa-heart"></i>
										</button>
									:
										<button
										className="btn btn-outline-danger ml-1"
										onClick={(e) => this.addFavorite(e, this.state.product.identify_code)}
										>
											<i className="fas fa-heart"></i>
										</button>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (<div></div>)
	}

	render() {
		return (<Base title="商品ページ" content={this.contents()}/>)
	}
}

export default Detail;