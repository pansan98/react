import React, {Component} from 'react';
import axios from 'axios';

import GlobalNav from '../../common/GlobalNav';
import PageLoader from '../../common/PageLoader';

class StopWatch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_live: false,
			current_time: 0,
			start_time: 0,
			laps: [],
			storage_laps: []
		}
		this.timer = 0;
		this.laps = [];
	}

	// マウントした時
	componentWillMount() {
		this.timer = setInterval((e) => {
			this.tick();
		}, 1000);
		this.fetch_laps();
	}

	// アンマウントした時
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	tick() {
		if(this.state.is_live) {
			const time = new Date().getTime();
			this.setState({current_time: time});
		}
	}

	// 開始・停止ボタン押下
	c_handler(e) {
		if(this.state.is_live) {
			// 終了する
			this.setState({is_live: false});
			return;
		}

		// 開始
		const time = new Date().getTime();
		this.setState({
			is_live: true,
			current_time: time,
			start_time: time,
			laps: []
		});
		this.laps = [];
	}

	c_lap(e) {
		if(this.state.is_live) {
			const [hh, mm, ss] = this.get_time();
			this.laps.push({
				number: this.state.laps.length + 1,
				time: hh+':'+mm+':'+ss
			})
			this.setState({
				laps: this.laps
			})
		}
	}

	c_save(e) {
		if(this.state.is_live) {
			window.alert('まず止めて');
			return;
		}
		if(!this.state.laps.length) {
			window.alert('ラップがない');
			return;
		}

		axios.post('/api/ps/stop-watch/save', {
			total_time: this.state.current_time,
			name: 'APIテスト',
			laps: this.state.laps
		}).then((res) => {
			if(res.data.result) {
				this.fetch_laps();
				window.alert('保存成功');
			} else {
				window.alert('保存失敗');
			}
		}).catch((e) => {
			console.log(e.message);
		});
	}

	fetch_laps()
	{
		axios.get('/api/ps/stop-watch', {
			credentials: 'same-origin'
		}).then((res) => {
			if(res.data.laps) {
				const laps = res.data.laps;
				this.setState({
					storage_laps: laps
				});
			}
		}).catch((e) => {
			console.log(e.message);
		})
	}

	// ラップの削除
	delete_lap(e) {
		const current = e.currentTarget;
		const lap_id = current.getAttribute('data');
		axios.post('/api/ps/stop-watch/destroy/' + lap_id).then((res) => {
			if(res.data.result) {
				this.fetch_laps();
				window.alert('削除OK');
			} else {
				window.alert('削除失敗');
			}
		})
	}

	get_laps() {
		if(!this.state.laps.length) return;

		const items = [];
		return (
			<div className="stopwatch-laps">
				{(() => {
					for(let i = 0; i < this.state.laps.length; i++) {
						items.push(<li key={i} className="lap">lap{this.state.laps[i].number}|{this.state.laps[i].time}</li>);
					}
					return (<ul>{items}</ul>)
				})()}
			</div>
		)
	}

	get_time()
	{
		const delta = this.state.current_time - this.state.start_time;
		const time = Math.floor(delta / 1000);
		const ss = time % 60;
		const m = Math.floor(time / 60);
		const mm = m % 60;
		const hh = Math.floor(mm / 60);

		const time_d = (n) => {
			const x = '00' + String(n);
			return x.slice(-2);
		}

		return [time_d(hh), time_d(mm), time_d(ss)];
	}

	// 時刻表示
	time_display() {
		const [hh, mm, ss] = this.get_time();

		return (
			<span className="time-display">
				{hh}:{mm}:{ss}
			</span>
		)
	}

	// 保存済みのラップ表示
	laps_display() {
		if(!this.state.storage_laps.length) return;

		return (<div className="storage-stopwatch-laps">
			<p>保存済みのラップ</p>
			<div className="stopwatch-lap-box">
				{
					this.state.storage_laps.map((v, i) => {
						const box_k = 'box-' + v.id;
						const d_k = 'delete-' + v.id;
						return (
							<div key={box_k} className="laps">
								<p key={i}>{v.name}</p>
								{
									this.state.storage_laps[i].laps.map((c_v, c_i) => {
										return (
											<li key={c_i}>Lap:{c_v.lap_number}、Time:{c_v.lap_time}</li>
										)
									})
								}
								<button key={d_k} onClick={(e) => {this.delete_lap(e)}} data={v.id}>消す</button>
							</div>
						)
					})
				}
			</div>
		</div>)
	}

	render() {
		let label = 'Start';
		if(this.state.is_live) {
			label = 'Stop';
		}

		return (
			<div className="wrapper">
				<h1>StopWatch Page</h1>
				<PageLoader />
				<GlobalNav />
				<div className="stopwatch-wrapper">
					<div>{this.time_display()}</div>
					<button onClick={(e) => {this.c_handler(e)}}>{label}</button>
					<button onClick={(e) => {this.c_lap(e)}}>Lap</button>
					<button onClick={(e) => {this.c_save(e)}}>Laps for save</button>
				</div>
				{this.get_laps()}
				<div>
					{this.laps_display()}
				</div>
			</div>
		)
	}
}

export default StopWatch;