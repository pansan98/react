import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';

class Views extends React.Component {
	constructor(props) {
		super(props);
	}

	tab_content() {
		return (
			<div className="tab-pane active show">
				<div className="overlay-wrapper">
					Content inserted
				</div>
			</div>
		)
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
					<div className="card card-primary card-tabs">
						<div className="card-header p-0 pt-1">
							<ul className="nav nav-tabs">
								<li className="nav-item">
									<button
										className="nav-link active"
									>
										購入履歴
									</button>
								</li>
								<li className="nav-item">
									<button
										className="nav-link"
									>
										口コミ/評価
									</button>
								</li>
							</ul>
						</div>
						<div className="card-body">
							<div className="tab-content">
								<div className="tab-content">{this.tab_content()}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (<Base title="商品関連情報" content={this.contents()}/>)
	}
}

export default Views;