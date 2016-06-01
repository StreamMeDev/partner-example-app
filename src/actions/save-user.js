import fs from 'fs';
import path from 'path';
import {dispatcher} from '../dispatcher';

export function saveUserAction (config, user) {
	// notify of starting
	dispatcher.dispatch({
		type: 'saveUser',
		status: 'loading'
	});

	return new Promise(function saveUser (resolve) {
		fs.writeFile(path.join(config.userData, 'user.json'), JSON.stringify(user), function (err) {
			if (err) {
				return resolve({
					type: 'saveUser',
					status: 'error',
					error: {
						message: 'Error saving user (' + err.code + ')',
						code: 'fs_error'
					}
				});
			}

			resolve({
				type: 'saveUser',
				status: 'success',
				user: user
			});
		});
	});
}
