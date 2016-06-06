import request from 'request';
import {dispatcher} from '../dispatcher';
import get from 'lodash.get';

export function createUserAction (config, userData) {
	// notify of starting
	dispatcher.dispatch({
		type: 'createUser',
		status: 'loading'
	});

	return new Promise(function createUser (resolve) {
		request({
			method: 'POST',
			url: config.apiHostname + '/api/v1/' + config.clientSlug + '/users',
			json: {
				username: userData.username,
				email: userData.email
			},
			timeout: 1000,
			auth: {
				user: config.clientId,
				pass: config.clientSecret
			}
		}, function (err, resp, body) {
			if (err) {
				return resolve({
					type: 'createUser',
					status: 'error',
					error: {
						message: 'Error creating user (' + err.code + ')',
						code: 'network_error'
					}
				});
			}

			if (resp.statusCode >= 400) {
				return resolve({
					type: 'createUser',
					status: 'error',
					error: get(body, 'reasons[0]', {
						message: 'Error creating user',
						code: 'create_user_error'
					})
				});
			}

			return resolve({
				type: 'createUser',
				status: 'success',
				user: body
			});
		});
	});
}
