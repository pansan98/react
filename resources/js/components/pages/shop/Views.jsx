import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';
import TabContents from '../../plugins/TabContents';

class Views extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			history: [],
			review: []
		}
	}

	fetch(type) {
		axios.get('/api/shop/views/' + this.props.code + '/' + type, {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				if(typeof this.state[type] !== 'undefined') {
					const state = {};
					state[type] = res.data.views;
					this.setState(state);
				}
			}
		})
	}

	tabs() {
		return [
			<div className="tab-pane active show">
				<div className="overlay-wrapper">
					購入履歴コンテンツ
				</div>
			</div>
			,
			<div className="tab-pane active show">
				<div className="overlay-wrapper">
					くちこみコンテンツ
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