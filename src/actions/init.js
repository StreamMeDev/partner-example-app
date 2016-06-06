import {dispatcher} from '../dispatcher';
import {getBroadcastAction} from './get-broadcast';
import {loadUserAction} from './load-user';
import {changeCurrentViewAction} from './change-current-view';
import {checkObsInstalledAction} from './check-obs-installed';
import {viewStreamAction} from './view-stream';

// Load user workflow
export function initAction (config) {
	// Load user from disk
	return loadUserAction(config)
		.then(function (action) {
			if (action.status === 'error') {
				return changeCurrentViewAction('signup');
			}

			if (action.status === 'success') {
				dispatcher.dispatch(action);

				return viewStreamAction(config, action.user)
					.then(function (action) {
						// if online, this will be the action, so show the stream
						if (action.type === 'changeCurrentView') {
							return action;
						}

						return getBroadcastAction(config, action.user)
							.then(function (action) {
								dispatcher.dispatch(action);
								if (action.status === 'success') {
									return changeCurrentViewAction('start-stream');
								}
							});
					});
			}
		})
		.then(function (action) {
			dispatcher.dispatch(action);
			return checkObsInstalledAction();
		});
}
