import React from 'react';
import {Link} from 'react-router-dom';

import Base from './Base';

class Event extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: false,
			events: []
		}
	}

	componentDidMount() {
		this.fetch();
	}

	async fetch() {
		const res = await axios.get('/api/event/', {
			credentials: 'same-origin'
		}).then((res) => {
			return res.data
		}).catch((e) => {
			return {result: false}
		})

		if(res.result) {
			this.setState({
				events: res.events
			})
		}
	}

	contents() {
		return (
			<div>
				<div className="card">
					<div className="card-body">
						<div className="search-form d-flex">
							<Link to="/event/category" className="btn btn-success ml-auto">カテゴリ</Link>
							<Link to="/event/create" className="btn btn-primary ml-1">追加</Link>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h3 className="card-title">My Events</h3>
					</div>
					<div className="card-body">
						<table className="table table-striped projects">
							<thead>
								<tr>
									<th>イベント名</th>
									<th>開催中のイベント数</th>
									<th>日程確認</th>
									<th className="text-center">操作</th>
								</tr>
							</thead>
							<tbody>
								{this.state.events.map((event, k) => {
									return (
										<tr key={`event-${k}`}>
											<td>{event.name}</td>
											<td>{event.schedules.length}</td>
											<td>
												<Link to={`/event/schedules/${event.id}`} className="btn btn-default">確認</Link>
											</td>
											<td className="text-center">
												<Link to={`/event/${event.id}/edit`} className="btn btn-primary">編集</Link>
												<button
													className="btn btn-danger ml-1"
												>
													<i className="fa fa-trash"></i>
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
		return (<Base title="イベント" content={this.contents()} loading={this.state.loading}/>)
	}
}

export default Event