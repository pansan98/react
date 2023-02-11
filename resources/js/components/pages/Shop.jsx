import React from 'react';
import {Link} from 'react-router-dom';

import Base from './Base';
import Search from '../forms/Search';

class Shop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: '',
			products: []
		}
	}

	componentDidMount() {
		axios.get('/api/shop/products', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.result) {
				this.setState({products: res.data.products});
			}
		}).catch((e) => {
			console.log(e);
		})
	}

	handlerSearch(name, value) {
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	contents() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<div className="search-form d-flex mt-2 p-1">
							<Search
								value={this.state.search}
								onChange={(name, value) => this.handlerSearch(name, value)}
							/>
							<Link to="/shop/create" className="btn btn-primary ml-auto">追加</Link>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">My Products</h3>
					</div>
					<div className="card-body p-0">
						<table className="table table-striped projects">
							<thead>
								<tr>
									<th>商品コード</th>
									<th>商品名</th>
									<th>評価割合</th>
									<th>売れ筋</th>
									<th>在庫状況</th>
									<th className="text-center">操作</th>
								</tr>
							</thead>
							<tbody>
								{this.state.products.map((v, k) => {
									return (
										<tr key={k}>
											<td>{v.identify_code}</td>
											<td>{v.name}</td>
											<td>星3.5</td>
											<td className="project_progress">
												30%
											</td>
											<td>
												<div className="inventoly">在庫数:<span>{v.inventoly}</span></div>
												<div className="inventoly-status"><span className="badge badge-success">在庫あり</span></div>
											</td>
											<td className="project-actions text-center">
												<button className="btn btn-primary btn-sm">
													View
												</button>
												<button className="btn btn-warning btn-sm ml-1">
													Page
												</button>
												<Link to={`/shop/edit/${v.identify_code}`} className="btn btn-info btn-sm ml-1">Edit</Link>
												<button className="btn btn-danger btn-sm ml-1">
													Delete
												</button>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (<Base title="Shop Dashboard" content={this.contents()} />)
	}
}

export default Shop;