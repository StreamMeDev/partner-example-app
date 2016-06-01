export function stopPollingUserStreamAction (user) {
	return {
		type: 'stopPollingUserStream',
		user: user
	};
}
