import React from 'react';

import Base from './Base';
import User from '../common/User';

const Home = () => {
	return (
		<Base title="Home" content={<User type="default"/>} />
	)
}

export default Home;