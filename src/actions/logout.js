import fs from 'fs';
import path from 'path';
import {dispatcher} from '../dispatcher';

export function logoutAction (config) {
	// notify of starting
	dispatcher.dispatch({
		type: 'logout',
		status: 'loading'
	});

	return new Promise(function logout (resolve) {
		fs.unlink(path.join(config.userData, 'user.json'), function (err) {
			if (err) {
				return resolve({
					type: 'logout',
					status: 'error',
					error: {
						message: 'Error logging out (' + err.code + ')',
						code: 'fs_error'
					}
				});
			}

			resolve({
				type: 'logout',
				status: 'success'
			});
		});
	});
}
