import {dispatcher} from '../dispatcher';
import {createUserAction} from './create-user';
import {saveUserAction} from './save-user';
import {getBroadcastAction} from './get-broadcast';
import {changeCurrentViewAction} from './change-current-view';

export function submitCreateUserFormAction (config, userData) {
	return createUserAction(config, userData)
		.then(function (action) {
			dispatcher.dispatch(action);
			if (action.status === 'success') {
				return saveUserAction(config, action.user);
			}
		}).then(function (action) {
			dispatcher.dispatch(action);
			if (action.status === 'success') {
				return getBroadcastAction(config, action.user);
			}
		}).then(function (action) {
			dispatcher.dispatch(action);
			if (action.status === 'success') {
				return changeCurrentViewAction('start-stream');
			}
		});
}
