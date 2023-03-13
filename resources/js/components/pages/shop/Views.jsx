import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import TabContents from '../../plugins/TabContents';
import Modal from '../../plugins/Modal';

class Views extends React.Component {
	constructor(props) {
		super(props);

		// デフォルトオプション
		this.config = {
			modals: {
				review: {
					active: false,
					title: '口コミ投稿',
					classes: ['modal-lg'],
					success: false,
					closefn: () => {},
					callbackfn: () => {}
				}
			}
		}

		this.state = {
			product: {},
			history: [],
			review: {},
			loaded: [],
			loading: false,
			modal_review: {
				active: this.config.modals.review.active,
				title: this.config.modals.review.title,
				classes: this.config.modals.review.classes,
				success: this.config.modals.review.success,
				closefn: () => this.config.modals.review.closefn,
				callbackfn: () => this.config.modals.review.callbackfn,
				comment: ''
			}
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

	async modalReviewComment(id) {
		this.setState({loading: true})
		const res = await Utils.apiHandler('get', '/api/shop/views/' + this.state.product.identify_code + '/review/comment/' + id, {
			credentials: 'same-origin'
		}, () => {
			this.setState({loading: false})
		}).then((res) => {
			return res.data
		}).catch((e) => {
			console.log(e)
		})

		if(res.result) {
			this.setState({
				modal_review: Object.assign(this.config.modals.review, {
					active: true,
					comment: res.comment,
					closefn: () => this.closeModalReviewComment()
				})
			})
		}
	}

	closeModalReviewComment() {
		this.setState({
			modal_review: Object.assign(this.config.modals.review, {
				active: false,
				comment: ''
			})
		})
	}

	modalReviewCommentContent(comment) {
		return (
			<div className="text-left">
				{comment}
			</div>
		)
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
											<p className="text-right">購入金額：{Utils.numberformat(this.state.product.price)}円</p>
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
											<button
											className="btn btn-default"
											onClick={(e) => this.modalReviewComment(review.id)}
											>
												口コミを読む
											</button>
										</div>
									)
								})}
							</div>
						</div>
					</div>
					:
					<div>口コミが投稿されていません。</div>}
				</div>

				<Modal
				title={this.state.modal_review.title}
				active={this.state.modal_review.active}
				classes={this.state.modal_review.classes}
				success={this.state.modal_review.success}
				closefn={this.state.modal_review.closefn}
				callbackfn={this.state.modal_review.callbackfn}
				>
					{this.modalReviewCommentContent(this.state.modal_review.comment)}
				</Modal>
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
		return (<Base title="商品関連情報" content={this.contents()} loading={this.state.loading}/>)
	}
}

Views.defaultProps = {
	code: ''
}

export default Views;