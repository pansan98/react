import React from 'react';

import GlobalNav from '../common/GlobalNav';
import PageLoader from '../common/PageLoader';
import User from '../common/User';
import SideMenu from '../common/SideMenu';

const Home = () => {
	return (
		<div className="wrapper">
			<PageLoader />
			<GlobalNav />
			<SideMenu />
			<div className="content-wrapper">
				<div className="content-header">
					<div className="container-fluid">
						<div className="row mb-2">
							<div className="col-sm-6">
								Home
							</div>
						</div>
					</div>
				</div>
				<section className="content">
					<div className="container-fluid">
					<User type="default" />
					</div>
				</section>
			</div>
		</div>
	)
}

export default Home;