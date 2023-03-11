import React from 'react'
import {Link} from 'react-router-dom'

import Styles from '../../../sass/plugins/Modal'

class Modal extends React.Component {
	constructor(props) {
		super(props)
	}

	close() {
		this.props.closefn()
	}

	header() {
		return (
			<div className="modal-header">
				<h4 className="modal-title">{this.props.title}</h4>
				{(this.props.close)
				?
				<button
				className="btn btn-default"
				onClick={(e) => this.close()}
				>
					<i className="fas fa-times"></i>
				</button>
				: ''}
			</div>
		)
	}

	footer() {
		return (
			<div className="modal-footer justify-content-between">
				{this.props.buttons.map((button, k) => {
					return (
						<button
						key={`modal-button-${k}`}
						className={button.classes.join(' ')}
						onClick={(e) => button.callbackfn()}
						>
							{button.name}
						</button>
					)
				})}
				{(this.props.success)
				?
				<button
				className="btn btn-primary ml-auto"
				onClick={(e) => this.props.callbackfn()}
				>
					Save
				</button>
				: ''}
			</div>
		)
	}

	render() {
		if(this.props.active) {
			return (
				<div className={Styles.mymodal}>
					<div className="modal-overlay"></div>
					<div className="modal">
						<div className={`modal-dialog ${this.props.classes.join(' ')}`}>
							<div className="modal-content">
								{this.header()}
								<div className="modal-body">
									{this.props.children}
								</div>
								{this.footer()}
							</div>
						</div>
					</div>
				</div>
			)
		}

		return (<div></div>)
	}
}

Modal.defaultProps = {
	active: false,
	classes: [],
	content: '<div>Plz Modal Contents.</div>',
	buttons: [],
	title: 'モーダル',
	close: true,
	closefn: () => {},
	success: true,
	callbackfn: () => {}
}

export default Modal