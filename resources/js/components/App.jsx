import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import StopWatch from './pages/practice/StopWatch';
import MyProfile from './pages/my/Profile';
import Shop from './pages/Shop';
import ShopCreate from './pages/shop/Edit';
import ShopEdit from './pages/shop/ParamsEdit';
import ShopViews from './pages/shop/ParamsViews';
import Ec from './pages/Ec';
import EcDetail from './pages/ec/ParamsDetail';
import EcCart from './pages/ec/Cart';
import EcFavorites from './pages/ec/Favorites';
import EcHistory from './pages/ec/History';
import EcReview from './pages/ec/ParamsReview';

import Event from './pages/Event';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';
import Authorize from './auth/ParamsAuthorize';
import Forgot from './auth/Forgot';
import Password from './auth/ParamsPassword';

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
						<Route path="/shop" element={<Shop />} />
						<Route path="/shop/create" element={<ShopCreate page="追加"/>} />
						<Route path="/shop/edit/:code" element={<ShopEdit />} />
						<Route path="/shop/views/:code" element={<ShopViews />} />
						<Route path="/ec" element={<Ec />} />
						<Route path="/ec/product/:code" element={<EcDetail />} />
						<Route path="/ec/cart" element={<EcCart />} />
						<Route path="/ec/favorites" element={<EcFavorites />} />
						<Route path="/ec/history" element={<EcHistory />} />
						<Route path="/ec/review/:code" element={<EcReview />} />
						<Route path="/event" element={<Event />} />
						<Route path="/my/profile" element={<MyProfile />} />
						<Route path="/practice/stop-watch" element={<StopWatch />} />
						<Route path="/auth/login" element={<Login />} />
						<Route path="/auth/register" element={<Register />} />
						<Route path="/auth/forgot" element={<Forgot />} />
						<Route path="/auth/authorize/:identify/:token" element={<Authorize />} />
						<Route path="/auth/password/:identify/:token" element={<Password />} />
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
