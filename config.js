module.exports = function (app) {
	return {
		cwd: __dirname,
		userData: app.getPath('userData'),
		height: 900,
		widht: 1440,
		hostname: 'https://www.stream.me',
		clientSlug: '',
		clientId: '',
		clientSecret: ''
	};
};
