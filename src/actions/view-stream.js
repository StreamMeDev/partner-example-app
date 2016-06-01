import {dispatcher} from '../dispatcher';
import {getUserStreamAction} from './get-user-stream';
import {changeCurrentViewAction} from './change-current-view';

export function viewStreamAction (config, user) {
	// notify of starting
	dispatcher.dispatch({
		type: 'viewStream',
		status: 'loading',
		user: user
	});

	return getUserStreamAction(config, user)
		.then(function (action) {
			if (action.status === 'error') {
				return {
					type: 'viewStream',
					status: 'error',
					error: action.error,
					user: user
				};
			}
			
			if (action.status === 'success') {
				dispatcher.dispatch({
					type: 'viewStream',
					status: 'success',
					user: user,
					stream: action.stream
				});
				return changeCurrentViewAction('stream');
			}
		});
}
