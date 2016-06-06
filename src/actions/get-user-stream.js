import request from 'request';
import {dispatcher} from '../dispatcher';
import get from 'lodash.get';

export function getUserStreamAction (config, user) {
	// notify of starting
	dispatcher.dispatch({
		type: 'getUserStream',
		status: 'loading',
		user: user
	});

	return new Promise(function getUserStream (resolve) {
		request({
			method: 'GET',
			url: config.apiHostname + '/api/v1/' + config.clientSlug + '/users/' + user.slug + '/stream',
			json: true,
			auth: {
				user: config.clientId,
				pass: config.clientSecret
			}
		}, function (err, resp, body) {
			if (err) {
				return resolve({
					type: 'getUserStream',
					status: 'error',
					user: user,
					error: {
						message: 'Error getting users stream (' + err.code + ')',
						code: 'network_error'
					}
				});
			}

			if (resp.statusCode >= 400) {
				return resolve({
					type: 'getUserStream',
					status: 'error',
					user: user,
					error: get(body, 'reasons[0]', {
						message: 'Error getting stream',
						code: 'get_stream_error'
					})
				});
			}

			return resolve({
				type: 'getUserStream',
				status: 'success',
				user: user,
				stream: body
			});
		});
	});
}
