import React from 'react';

import GlobalNav from '../common/GlobalNav';
import PageLoader from '../common/PageLoader';
import User from '../common/User';

const Home = () => {
	return (
		<div className="wrapper">
			<h1>Home</h1>
			<User />
			<PageLoader />
			<GlobalNav />
		</div>
	)
}

export default Home;