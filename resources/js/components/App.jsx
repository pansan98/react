import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import StopWatch from './pages/practice/StopWatch';
import MyProfile from './pages/my/Profile';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BrowserRouter>
				<React.Fragment>
					<Routes>
						<Route path="/" exact element={<Home />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/my/profile" element={<MyProfile />} />
						<Route path="/practice/stop-watch" element={<StopWatch />} />
						<Route path="/auth/login" element={<Login />} />
						<Route path="/auth/register" element={<Register />} />
					</Routes>
				</React.Fragment>
			</BrowserRouter>
		)
	}
}

export default App;

if (document.getElementById('app')) {
	ReactDOM.render(<App />, document.getElementById('app'));
}
