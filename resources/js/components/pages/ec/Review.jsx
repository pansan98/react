import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import Loader from '../../common/Loader';
import Textarea from '../../forms/Textarea';
import Radio from '../../forms/Radio';
import Error from '../../forms/Error';

class Review extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: {},
			forms: {
				star: 0,
				comment: ''
			},
			errors: {
				star: [],
				comment: []
			},
			loading: false,
			saved: false
		}
	}

	componentDidMount() {
		this.fetch();
	}

	async fetch() {
		await axios.get('/api/shop/review/product/' + this.props.code, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({product: res.data.product});
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	handlerChange(name, value)
	{
		const param = this.state.forms;
		param[name] = value;
		this.setState({forms: param});
	}

	save(e) {
		this.setState({loading: true});
		axios.post('/api/shop/review/create/' + this.props.code, {
			star: this.state.forms.star,
			comment: this.state.forms.comment,
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
				<div>
					<Loader is_loading={this.state.loading}/>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-body">
									<div className="d-flex">
										<Link to="/ec/history" className="btn btn-default">戻る</Link>
										<button className="btn btn-primary ml-auto" onClick={(e) => this.save(e)}>保存</button>
									</div>
								</div>
							</div>
							<div className="card p-3">
								<div className="card-header">
									「{this.state.product.name}」についてお聞かせください。<br/>購入者から頂いたレビューは出品者にも共有されます。
								</div>
								<div className="card-body">
									<Radio
										label="星"
										formName="star"
										value={this.state.forms.star}
										values={[{label: 1, value: 1},{label: 2, value:2},{label: 3, value: 3},{label: 4, value: 4},{label: 5, value: 5}]}
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Error error={this.state.errors.star} />
									<Textarea
										label="コメント"
										formName="comment"
										value={this.state.forms.comment}
										onChange={(name, value) => this.handlerChange(name, value)}
									/>
									<Error error={this.state.errors.comment} />
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div>
					<div className="card">
						<div className="card-body">
							<div className="d-flex">
								<Link to="/ec/history" className="btn btn-default">戻る</Link>
							</div>
						</div>
					</div>
					<div className="card">
						<div className="card-body">
							レビューの投稿ありがとうございました。<br/>
							投稿して頂いたレビューは出品者にも共有されます。
						</div>
					</div>
				</div>
			)
		}
	}

	render() {
		return (<Base title="評価" content={this.contents()}/>)
	}
}

Review.defaultProps = {
	code: ''
}

export default Review;