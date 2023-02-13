import React from 'react';
import {Slider, Slide, ButtonBack, ButtonNext, CarouselProvider} from 'pure-react-carousel';

import Base from '../Base';
import SliderStyle from '../../../../sass/plugins/Slider';

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
			console.log(res.data);
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
										<ButtonBack>Back</ButtonBack>
										<ButtonNext>Next</ButtonNext>
									</CarouselProvider>
									: ''}
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
									<button className="btn btn-outline-danger ml-1">Add to Favo</button>
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