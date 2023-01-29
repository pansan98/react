import React from 'react';

import GlobalNav from '../common/GlobalNav';
import PageLoader from '../common/PageLoader';

const Home = () => {
	return (
		<div className="wrapper">
			<h1>Home</h1>
			<PageLoader />
			<GlobalNav />
		</div>
	)
}

export default Home;