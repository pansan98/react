import React from 'react';
import {Link} from 'react-router-dom';

import Loader from '../../common/Loader';

import Base from '../Base';
import Text from '../../forms/Text';
import Radio from '../../forms/Radio';
import Textarea from '../../forms/Textarea';
import Select from '../../forms/Select';
import Checkbox from '../../forms/Checkbox';
import Uploader from '../../forms/Uploader';
import Error from '../../forms/Error';

class Edit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			price: '',
			thumbnails: [],
			identify_code: '',
			description: '',
			benefits: '',
			benefits_start: '',
			benefits_end: '',
			inventoly: 1,
			inventoly_danger: 1,
			max_purchase: 1,
			fasted_delivery_day: 3,
			customs: [],
			errors: {
				name: [],
				price: [],
				thumbnails: [],
				identify_code: [],
				description: [],
				benefits: [],
				benefits_start: [],
				benefits_end: [],
				inventoly: [],
				inventoly_danger: [],
				max_purchase: [],
				fasted_delivery_day: [],
				customs: []
			},
			labels: {
				inventoly: [],
				inventoly_danger: [],
				max_purchase: [],
				fasted_delivery_day: []
			},
			loading: false,
			saved: false
		}
	}

	componentDidMount() {
		this.setState({identify_code: this.props.code})
		if(this.props.code !== '') {
			axios.get('/api/shop/product/' + this.props.code, {
				credentials: 'same-origin'
			}).then((res) => {
				if(res.data.result) {
					this.setState({
						name: res.data.product.name,
						price: res.data.product.price,
						description: res.data.product.description,
						benefits: res.data.product.benefits,
						inventoly: res.data.product.inventoly,
						inventoly_danger: res.data.product.inventoly_danger,
						max_purchase: res.data.product.max_purchase,
						fasted_delivery_day: res.data.product.fasted_delivery_day
					})
				}
			}).catch((e) => {
				console.log(e);
			})
		}
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	async save(e) {
		this.setState({loading: true});
		let endpoint;
		if(this.props.code !== '') {
			endpoint = '/api/shop/edit/' + this.props.code;
		} else {
			endpoint = '/api/shop/create';
		}
		await axios.post(endpoint, {
			name: this.state.name,
			price: this.state.price,
			thumbnails: this.state.thumbnails,
			identify_code: this.state.identify_code,
			description: this.state.description,
			benefits: this.state.benefits,
			inventoly: this.state.inventoly,
			inventoly_danger: this.state.inventoly_danger,
			max_purchase: this.state.max_purchase,
			fasted_delivery_day: this.state.fasted_delivery_day,
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({saved: true});
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

	contents() {
		if(!this.state.saved) {
			return (
				<div className="row">
					<Loader is_loading={this.state.loading}/>
					<div className="col-12">
						<div className="card">
							<div className="card-body">
								<div className="d-flex">
									<Link to="/shop" className="btn btn-default">戻る</Link>
									<button className="btn btn-primary ml-auto" onClick={(e) => this.save(e)}>{this.props.page}</button>
								</div>
							</div>
						</div>
						<div className="card p-3">
							<div className="card-body">
								<Text
									label="商品名"
									formName="name"
									value={this.state.name}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.name}/>
								<Text
									label="商品識別コード"
									formName="identify_code"
									value={this.state.identify_code}
									placeholder="未入力の場合は自動的に付与されます。"
									readOnly={(this.props.code !== '') ? true : false}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.identify_code}/>
								<Text
									label="価格(税抜)"
									formName="price"
									value={this.state.price}
									placeholder="半角数字のみで入力してください。税込価格は自動で計算されます。"
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.price}/>
								// TODO 保存済み画像の表示
								<Uploader
									label="イメージ画像"
									formName="thumbnails"
									message="画像をアップロード"
									value={this.state.thumbnails}
									maxFile="5"
									multiple={true}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Textarea
									label="商品説明欄"
									formName="description"
									value={(this.state.description) ? this.state.description : ''}
									row="5"
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.description}/>
								<Select
									label="在庫数"
									formName="inventoly"
									value={this.state.inventoly}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.inventoly}/>
								<Select
									label="在庫通知数"
									formName="inventoly_danger"
									value={this.state.inventoly_danger}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.inventoly_danger}/>
								<Select
									label="一度に購入できる最大数"
									formName="max_purchase"
									value={this.state.max_purchase}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.max_purchase}/>
								<Select
									label="最短お届け可能日数"
									formName="fasted_delivery_day"
									value={this.state.fasted_delivery_day}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.fasted_delivery_day}/>
							</div>
							<button className="btn btn-primary ml-auto" onClick={(e) => this.save(e)}>{this.props.page}</button>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<Link to="/shop" className="btn btn-default">戻る</Link>
						</div>
						<p className="text-center">保存しました。</p>
					</div>
				</div>
			)
		}
	}

	render() {
		return (<Base title={`商品${this.props.page}`} content={this.contents()}/>)
	}
}

Edit.defaultProps = {
	code: '',
	page: ''
}

export default Edit;