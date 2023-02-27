import React from 'react';
import {Link} from 'react-router-dom';

class TabContents extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			active: 0
		}
	}

	onTab(e, k) {
		if(this.props.callback) {
			this.props.onChange(k);
		}
		this.setState({active: k});
	}

	list_content() {
		return (
			<ul className="nav nav-tabs">
				{this.props.list.map((v, k) => {
					let active = '';
					if(k === this.state.active) {
						active = ' active';
					}

					return (
						<li key={`list-${k}`} className="nav-item">
							<button className={`nav-link${active}`} onClick={(e) => this.onTab(e, k)}>
								{v}
							</button>
						</li>
					)
				})}
			</ul>
		)
	}

	tab_content() {
		return (
			<div className="card-body">
				{this.props.contents.map((v, k) => {
					if(this.state.active === k) {
						return (
							<div key={`contents-${k}`} className="tab-content">
								{v}
							</div>
						)
					} else {
						return (<div key={`contents-${k}`}></div>)
					}
				})}
			</div>
		)
	}

	render() {
		return (
			<div>
				<div className="card card-primary card-tabs">
					<div className="card-header p-0 pt-1">
						{this.list_content()}
					</div>
					{this.tab_content()}
				</div>
			</div>
		)
	}
}

TabContents.defaultProps = {
	list: [],
	contents: [],
	callback: false
}

export default TabContents;