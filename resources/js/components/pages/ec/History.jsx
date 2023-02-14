import React from 'react';
import {Link} from 'react-router-dom';

import Base from '../Base';

class History extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			histories: []
		}
	}

	componentDidMount() {
		this.fetch();
	}

	async fetch() {
		await axios.get('/api/shop/history', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({histories: res.data.histories})
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	contents() {
		return (
			<div className="card">
				<div className="card-body">
					<div className="d-flex">
						<Link to="/ec" className="btn btn-default">戻る</Link>
					</div>
				</div>
				<div className="card-body">
					{this.state.histories.map((history, h_k) => {
						return (
							<div key={`history-${h_k}`} className="tab-pane">
								<div className="time-label"><span className="bg-danger">{history.created_at}</span></div>
								<div>
									{history.products.map((product, p_k) => {
										return (
											<div key={`product-${p_k}-${product.identify_code}`} className="card-body">
												<div className="timeline-item">
													<h3 className="timeline-header">{product.name}</h3>
													<div className="timeline-body">
														{product.description}
													</div>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}

	render() {
		return (<Base title="購入履歴" content={this.contents()}/>)
	}
}

export default History;