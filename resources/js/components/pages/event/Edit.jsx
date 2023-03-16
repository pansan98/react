import React from 'react'
import {Link} from 'react-router-dom'

import Base from '../Base'
import Uploader from '../../forms/Uploader'
import Text from '../../forms/Text'
import Textarea from '../../forms/Textarea'
import Radio from '../../forms/Radio'
import Error from '../../forms/Error'

class Edit extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			saved: false,
			loading: false,
			name: '',
			comment: '',
			thumbnails: [],
			active_flag: 1,
			errors: {
				name: [],
				comment: [],
				thumbnails: [],
				active_flag: []
			}
		}
	}

	handlerChange(name, value)
	{
		const param = {};
		param[name] = value;
		this.setState(param);
	}

	contents() {
		if(!this.state.saved) {
			return (
				<div className="row">
					<div className="col-12">
						<div className="card">
							<div className="card-body">
								<div className="d-flex">
									<Link to="/event" className="btn btn-default">戻る</Link>
									<button className="btn btn-primary ml-auto">保存</button>
								</div>
							</div>
						</div>
						<div className="card p-3">
							<div className="card-body">
								<Text
									label="イベント名"
									formName="name"
									value={this.state.name}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.name}/>
								<Textarea
									label="コメント"
									formName="comment"
									value={this.state.comment}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.comment}/>
								<Uploader
									label="画像"
									formName="thumbnails"
									value={this.state.thumbnails}
									message="画像をアップロード"
									maxFile={5}
									multiple={true}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
								<Error error={this.state.errors.thumbnails}/>
								<Radio
									label="公開ステータス"
									formName="active_flag"
									value={this.state.active_flag}
									values={[{label: '公開',value:1},{label: '非公開',value: 0}]}
									onChange={(name, value) => this.handlerChange(name, value)}
								/>
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="card">
					<div className="card-body">
						<div className="d-flex">
							<Link to="/event" className="btn btn-default">戻る</Link>
						</div>
						<p className="text-center">保存しました。</p>
					</div>
				</div>
			)
		}
	}

	render() {
		return (<Base title="イベント追加" content={this.contents()} loading={this.state.loading}/>)
	}
}

export default Edit