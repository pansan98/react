import React from 'react';
import {Link} from 'react-router-dom';

import Base from './Base';
import Loader from '../common/Loader';

class Ec extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: []
		}
	}

	componentDidMount() {
		this.fecth();
	}

	async fecth() {
		await axios.get('/api/shop/ec/products', {
			credentials: 'sme-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({products: res.data.products});
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	contents() {
		return (
			<div className="card card-list">
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
														return (
															<img key={t_k} src={thumbnail.path} alt={thumbnail.name} className="img-circle-img-fluid" width="100"/>
														)
													})}
												</div>
											</div>
										</div>
										<div className="card-footer">
											<div className="d-flex">
												<button
												className="btn btn-outline-danger"
												>
													Favo
												</button>
												<button
												className="btn btn-default ml-1"
												>
													カートに追加
												</button>
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
		)
	}

	render() {
		return (<Base title="Enjoy your Shopping." content={this.contents()}/>)
	}
}

export default Ec;