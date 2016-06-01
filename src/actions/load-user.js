import fs from 'fs';
import path from 'path';
import {dispatcher} from '../dispatcher';

export function loadUserAction (config) {
	// notify of starting
	dispatcher.dispatch({
		type: 'loadUser',
		status: 'loading'
	});

	return new Promise(function loadUser (resolve) {
		fs.readFile(path.join(config.userData, 'user.json'), {encoding: 'utf8'}, function (err, body) {
			if (err) {
				return resolve({
					type: 'loadUser',
					status: 'error',
					error: {
						message: 'Error loading user (' + err.code + ')',
						code: 'fs_error'
					}
				});
			}

			try {
				var user = JSON.parse(body);
			} catch (e) {
				return resolve({
					type: 'loadUser',
					status: 'error',
					error: {
						message: 'Error loading user (' + e.code + ')',
						code: 'invalid_data_error'
					}
				});
			}

			resolve({
				type: 'loadUser',
				status: 'success',
				user: user
			});
		});
	});
}
