export function startPollingUserStreamAction (user) {
	return {
		type: 'startPollingUserStream',
		user: user
	};
}
