import React from 'react';

import Base from '../Base';

class Profile extends React.Component {
	constructor(props) {
		super(props);
	}

	contents() {
		return (
			<div className="row">
				<div className="col-md-3">
					<div className="card card-primary card-outline">
						<div className="card-body box-profile">
							<div className="text-center"></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Base title="Profile" content={this.contents()} />
		)
	}
}

export default Profile;