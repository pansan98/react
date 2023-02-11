import React from 'react';

class Search extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col-10">
				<div className="input-group">
					<input
						className="form-control"
						type="text"
						placeholder="商品名を入力してください。"
						value={this.props.value}
						onChange={(e) => this.props.onChange(this.props.formName, e.currentTarget.value)}
					/>
					<div className="input-group-append">
						<button className="btn btn-default">
							検索
						</button>
					</div>
				</div>
			</div>
		)
	}
}

Search.defaultProps = {
	value: '',
	formName: 'search'
}

export default Search;