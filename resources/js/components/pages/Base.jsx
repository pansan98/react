import React from 'react';

import GlobalNav from '../common/GlobalNav';
import PageLoader from '../common/PageLoader';
import Loader from '../common/Loader';
import SideMenu from '../common/SideMenu';

class Base extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="wrapper">
				<PageLoader />
				<Loader is_loading={this.props.loading}/>
				<GlobalNav />
				<SideMenu user={this.props.user}/>
				<div className="content-wrapper">
					<div className="content-header">
						<div className="container-fluid">
							<div className="row mb-2">
								<div className="col-sm-6">
									{this.props.title}
								</div>
							</div>
						</div>
					</div>
					<section className="content">
						<div className="container-fluid">
							{this.props.content}
						</div>
					</section>
				</div>
			</div>
		)
	}
}

Base.defaultProps = {
	title: '',
	content: '',
	loading: false
}

export default Base;