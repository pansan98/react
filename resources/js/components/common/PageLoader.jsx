import React from 'react';

const PageLoader = () => {
	return (
		<div className="preloader flex-column justify-content-center align-items-center">
			<img src="/assets/img/logo.png" className="animation__shake" height="60" width="60" />
		</div>
	)
}

export default PageLoader;