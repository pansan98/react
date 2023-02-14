import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import Loader from '../../common/Loader';

class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			payed: false,
			loading: false
		}
	}

	componentDidMount() {
		this.fetch();
	}

	async fetch() {
		await axios.get('/api/shop/cart/my', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({products: res.data.products});
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	pay(e) {
		this.setState({loading: true});
		axios.post('/api/shop/cart/pay', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({payed: true});
			}
		}).catch((e) => {
			console.log(e);
		}).finally(() => {
			this.setState({loading: false});
		})
	}

	cart() {
		if(!this.state.payed) {
			return (
				<div className="card">
					<div className="card-body">
						<div className="row">
							<div className="col-12 col-md-12 col-lg-8 order-2 order-md-1">
								<div className="row">
									<div className="col-12">
										<h4>現在のカートの中身</h4>
										{(this.state.products.length) ? 
										this.state.products.map((product, k) => {
											return (
												<div key={k} className="post">
													<div className="user-block">
														<span className="username">{product.name}</span>
													</div>
													<p>{product.description}</p>
												</div>
											)
										})
										: '何もありません;-;'}
									</div>
								</div>
							</div>
							<div className="col-12 col-md-12 col-lg-4 order-1 order-md-2">
								<h3 className="text-primary">Laravel-React Shop</h3>
								<p>購入された際、「Laravel-React Shop」の規約に同意したことと同じになります。</p>
								<div className="mt-5 mb-3 d-flex">
									<Link to="/ec" className="btn btn-default">ショッピングに戻る</Link>
									{(this.state.products.length) ?
									<button
									className="btn btn-primary ml-auto"
									onClick={(e) => this.pay(e)}
									>
										購入する
									</button>
									: ''}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="card">
					<div className="card-body">
						<p>ご購入ありがとうございます。詳細については別途メールをご確認ください。<br/>またのご利用をお待ちしております。</p>
					</div>
				</div>
			)
		}
	}

	contents() {
		return (
			<div>
				<Loader is_loading={this.state.loading}/>
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<Link to="/ec" className="btn btn-default">戻る</Link>
						</div>
					</div>
				</div>
				{this.cart()}
			</div>
		)
	}

	render() {
		return (<Base title="カート情報" content={this.contents()}/>)
	}
}

export default Cart;