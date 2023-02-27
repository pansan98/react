import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import TabContents from '../../plugins/TabContents';

class Views extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			product: {},
			history: [],
			review: {},
			loaded: []
		}
		this.keys = {0: 'history', 1: 'review'}
	}

	componentDidMount() {
		this.fetch('history')
	}

	fetch(type) {
		if(!this.state.loaded.includes(type)) {
			axios.get('/api/shop/views/' + this.props.code + '/' + type, {
				credentials: 'same-origin'
			}).then((res) => {
				if(res.data.result) {
					const state = {};
					state.loaded = this.state.loaded;
					state.loaded.push(type);
					state.product = (res.data.product) ? res.data.product : this.state.product;
					if(typeof this.state[type] !== 'undefined') {
						state[type] = res.data.views;
					}
					this.setState(state);
				}
			}).catch((e) => {
				console.log(e)
			})
		}
	}

	onTab(type) {
		if(typeof this.keys[type] !== 'undefined') {
			this.fetch(this.keys[type])
		}
	}

	tabs() {
		return [
			<div className="tab-pane active show">
				<div className="overlay-wrapper">
					{this.state.history.map((history, k) => {
						return (
							<div key={`history-${k}`} className="tab-pane btn-outline-info">
								<div className="time-label"><span className="bg-danger p-2">{Utils.dateformat(history.created_at)}</span></div>
								<div>
									<div className="card-body">
										<div className="timeline-item">
											<h3 className="timeline-header">{this.state.product.name}</h3>
											<div className="timeline-body">
												{this.state.product.description}
											</div>
											<p className="text-right">購入金額：{this.state.product.history_price}円</p>
										</div>
									</div>
									<hr/>
								</div>
							</div>
						)
					})}
				</div>
			</div>
			,
			<div className="tab-pane active show">
				<div className="overlay-wrapper">
					{(this.state.review && this.state.review.total > 0) ?
					<div>
						<div>
							<p>口コミ投稿数：{this.state.review.total}件</p>
							<div className="row">
								{this.state.review.reviews.map((review, k) => {
									return (
										<div key={`review-${k}`} className="col-12">
											<p>口コミ投稿者：{review.user.name}{(!review.viewed) ? <i className="text-right fab fa-readme"></i> : ''}</p>
											<p className="fs-l">評価：{review.star}</p>
											<button className="btn btn-default">口コミを読む</button>
										</div>
									)
								})}
							</div>
						</div>
					</div>
					:
					<div>口コミが投稿されていません。</div>}
				</div>
			</div>
		]
	}

	contents() {
		return (
			<div className="row">
				<div className="col-12">
					<div className="card">
						<div className="card-body">
							<div className="d-flex">
								<Link to="/shop" className="btn btn-default">戻る</Link>
							</div>
						</div>
					</div>
					<TabContents
					list={['購入履歴', 'くちこみ評価']}
					contents={this.tabs()}
					onChange={(type) => this.onTab(type)}
					callback={true}
					/>
				</div>
			</div>
		)
	}

	render() {
		return (<Base title="商品関連情報" content={this.contents()}/>)
	}
}

Views.defaultProps = {
	code: ''
}

export default Views;