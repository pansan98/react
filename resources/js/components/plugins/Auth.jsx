class Auth {
	constructor() {
		this.redirect_path = {
			login: '/auth/login',
			home: '/'
		}
	};

	is_login() {
		return true;
	};
}

export default Auth;