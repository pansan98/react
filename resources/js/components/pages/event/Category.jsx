import React from 'react'
import {Link} from 'react-router-dom'

import Base from '../Base'

class Category extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			categories: []
		}
	}

	contents() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<Link to="/event/category/create" className="btn btn-primary">追加</Link>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">My Event Categories</h3>
					</div>
					<div className="card-body">
						<table className="table table-striped projects">
							<thead>
								<tr>
									<th>名前</th>
									<th className="text-center">操作</th>
								</tr>
							</thead>
							<tbody>
								{this.state.categories.map((category, k) => {
									return (
										<tr key={`category-${k}`}>
											<td>{category.name}</td>
											<td className="text-center">
												<button className="btn btn-primary">編集</button>
												<button className="btn btn-danger ml-1"><i className="fa fa-trash"></i></button>
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
		return (<Base title="イベントカテゴリ" content={this.contents()}/>)
	}
}

export default Category