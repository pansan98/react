import React from 'react';

import Base from '../Base';

class Detail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {}
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
				this.setState({product: res.data.product});
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	contents() {
		if(this.state.product) {
			return (
				<div className="card card-solid">
					<div className="card-body">
						<div className="row">
							<div className="col-12 col-sm-6">
								<h3 className="d-inline-block d-sm-none">{this.state.product.name}</h3>
								<div className="col-12">
								</div>
							</div>
							<div className="col-12 col-sm-6">
								<h3 className="my-3">{this.state.product.name}</h3>
								<p>{this.state.product.description}</p>
								<hr/>
								<div className="bg-gray py-2 px-3 mt-4">
									<h2 className="mb-0">{new Intl.NumberFormat('ja-JP').format(this.state.product.price)}円</h2>
									<h4 className="mt-0">
										<small>{new Intl.NumberFormat('ja-JP').format((this.state.product.price + (this.state.product.price * 0.1)))}円(税込)</small>
									</h4>
								</div>
								<div className="mt-4">
									<button className="btn btn-primary">Add to Cart</button>
									<button className="btn btn-outline-danger">Add to Favo</button>
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