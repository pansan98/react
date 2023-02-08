import React from 'react';
import Loader from 'react-loader-spinner';

import FileUploader from '../plugins/FileUploader';
import Style from '../../../sass/forms/Uploader';

class Uploader extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			uploaded: false,
			uploading: false,
			files: []
		}
		this.uploader;
	}

	componentDidMount() {
		this.uploader = new FileUploader({});
	}

	// アップロード描画
	upload_content() {
		return (
			<div id={this.props.action} className="row">
				<div id={this.props.dropzone} className="col-12 align-items-center dropzone">
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
				<div className="row mt-2">
					<div className="col-auto d-flex align-items-center">
						{this.state.files.map((v, k) => {
							if(v.type === 'image') {
								return (
									<span key={`span-${k}`} className="preview">
										<img key={`img-${k}`} src={v.path} className="img"/>
									</span>
								)
							}
						})}
					</div>
					<div className="col-2 d-flex align-items-center">
						<div className="btn-group">
							<button className="btn btn-warning cancel">Cancel</button>
						</div>
					</div>
				</div>
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
	message: 'ファイルをアップロード'
}

export default Uploader;