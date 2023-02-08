import React from 'react';

import GlobalNav from '../common/GlobalNav';
import PageLoader from '../common/PageLoader';
import SideMenu from '../common/SideMenu';

class Base extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="wrapper">
				<PageLoader />
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

export default Base;