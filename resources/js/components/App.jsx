import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './pages/Home';
import Contact from './pages/Contact';
import StopWatch from './pages/StopWatch';

const App = () => {
	return (
		<BrowserRouter>
			<React.Fragment>
				<Routes>
					<Route path="/" exact element={<Home />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/stop-watch" element={<StopWatch />} />
				</Routes>
			</React.Fragment>
		</BrowserRouter>
	);
}

export default App;

if (document.getElementById('app')) {
	ReactDOM.render(<App />, document.getElementById('app'));
}
