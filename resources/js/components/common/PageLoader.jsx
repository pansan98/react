import React from 'react';

class PageLoader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false
		}
		this.loader;
	}

	componentDidMount() {
		this.loader = document.getElementById('page-loader');
		setTimeout((e) => {
			this.done();
		}, 200);
	}

	done()
	{
		if(this.loader) {
			this.loader.style.display = 'none';
		}
	}

	render() {
		return (
			<div id="page-loader" className="preloader flex-column justify-content-center align-items-center">
				<img src="/assets/img/logo.png" className="animation__shake" height="60" width="60" />
			</div>
		)
	}
}

export default PageLoader;