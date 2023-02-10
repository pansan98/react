import React from 'react';

import FileUploader from '../plugins/FileUploader';
import Style from '../../../sass/forms/Uploader';

class Uploader extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			uploaded: false,
			classes: {
				dragover: ''
			},
			files: []
		}
		this.uploader;
	}

	componentDidMount() {
		this.uploader = new FileUploader({
			callbacks: {
				uploaded_fn: () => {
					this.onUploaded()
				}
			}
		});
	}

	onDragover(e) {
		e.preventDefault();
		this.setState({
			classes: {
				dragover: 'dragover'
			}
		})
	}

	onDragleave(e) {
		e.preventDefault();
		this.setState({
			classes: {
				dragover: ''
			}
		})
	}

	onDrop(e) {
		e.preventDefault();
		this.setState({
			classes: {
				dragover: ''
			}
		})
		this.uploader.upload(e);
	}

	onUploaded() {
		const files = this.uploader.flush();
		this.setState({
			uploaded: true,
			files: files
		});
		this.props.onChange(this.props.formName, files);
		this.uploader.roger();
	}

	onCancel(e, identify) {
		this.uploader.trash(identify);
		const files = this.uploader.flush();
		this.setState({
			uploaded: (files.length),
			files: files
		})
		this.props.onChange(this.props.formName, files);
	}

	// アップロード描画
	upload_content() {
		return (
			<div id={this.props.action} className="row">
				<div
					id={this.props.dropzone}
					className={`col-12 align-items-center dropzone ${this.state.classes.dragover}`}
					onDragOver={(e) => this.onDragover(e)}
					onDragLeave={(e) => this.onDragleave(e)}
					onDrop={(e) => this.onDrop(e)}
				>
					<div className="col-12 d-flex align-items-center">
						<span className="message">{this.props.message}</span>
					</div>
				</div>
			</div>
		)
	}

	// プレビュー描画
	preview_content() {
		return (
			<div id={this.props.uploaded} className="table table-striped files uploader-preview">
				{this.state.files.map((v, k) => {
					if(v.type === 'image') {
						return (
							<div key={k} className="row mt-2">
								<div className="col-auto d-flex align-items-center">
									<span key={`span-${k}`} className="preview">
									<img key={`img-${k}`} src={v.path} className="img"/>
								</span>
								</div>
								<div className="col-2 d-flex align-items-center">
									<div className="btn-group">
										<button key={`cancel-${k}`} className="btn btn-warning cancel" onClick={(e) => this.onCancel(e, v.identify_code)}>Cancel</button>
									</div>
								</div>
							</div>
						)
					}
				})}
			</div>
		)
	}

	contents() {
		if(this.state.uploaded) {
			return this.preview_content();
		} else {
			return this.upload_content();
		}
	}

	render() {
		return (
			<div className="form-group">
				<label>{this.props.label}</label>
				<div id={this.props.uploader} className={`card-body ${Style.app}`}>
					{this.contents()}
				</div>
			</div>
		)
	}
}

Uploader.defaultProps = {
	uploader: 'app-uploader',
	action: 'upload-action',
	dropzone: 'upload-dropzoen',
	uploaded: 'uploaded',
	message: 'ファイルをアップロード',
	value: {}
}

export default Uploader;