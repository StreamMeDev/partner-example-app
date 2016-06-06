import request from 'request';
import {dispatcher} from '../dispatcher';
import get from 'lodash.get';

export function resetStreamKeyAction (config, user) {
	// notify of starting
	dispatcher.dispatch({
		type: 'resetStreamKey',
		status: 'loading'
	});

	return new Promise(function resetStreamKey (resolve) {
		request({
			method: 'DELETE',
			url: config.apiHostname + '/api/v1/' + config.clientSlug + '/users/' + user.slug + '/broadcast',
			json: true,
			auth: {
				user: config.clientId,
				pass: config.clientSecret
			}
		}, function (err, resp, body) {
			if (err) {
				return resolve({
					type: 'resetStreamKey',
					status: 'error',
					error: {
						message: 'Error reseting stream key (' + err.code + ')',
						code: 'network_error'
					}
				});
			}

			if (resp.statusCode >= 400) {
				return resolve({
					type: 'resetStreamKey',
					status: 'error',
					error: get(body, 'reasons[0]', {
						message: 'Error reseting stream key',
						code: 'reset_stream_key_error'
					})
				});
			}

			return resolve({
				type: 'resetStreamKey',
				status: 'success',
				broadcastKey: body.broadcastKey
			});
		});
	});
}
