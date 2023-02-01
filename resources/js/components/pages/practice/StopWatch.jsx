import React, {Component} from 'react';

import GlobalNav from '../../common/GlobalNav';

class StopWatch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_live: false,
			current_time: 0,
			start_time: 0,
			laps: []
		}
		this.timer = 0;
		this.laps = [];
	}

	// マウントした時
	componentWillMount() {
		this.timer = setInterval((e) => {
			this.tick();
		}, 1000);
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

	render() {
		let label = 'Start';
		if(this.state.is_live) {
			label = 'Stop';
		}

		return (
			<div className="wrapper">
				<h1>StopWatch Page</h1>
				<GlobalNav />
				<div className="stopwatch-wrapper">
					<div>{this.time_display()}</div>
					<button onClick={(e) => {this.c_handler(e)}}>{label}</button>
					<button onClick={(e) => {this.c_lap(e)}}>Lap</button>
					<button>Laps for save</button>
				</div>
				{this.get_laps()}
			</div>
		)
	}
}

export default StopWatch;