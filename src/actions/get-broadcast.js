import request from 'request';
import {dispatcher} from '../dispatcher';
import get from 'lodash.get';

export function getBroadcastAction (config, user) {
	// notify of starting
	dispatcher.dispatch({
		type: 'getBroadcast',
		status: 'loading'
	});

	return new Promise(function getBroadcast (resolve) {
		request({
			method: 'GET',
			url: config.hostname + '/api-partners/v1/' + config.clientSlug + '/users/' + user.slug + '/broadcast',
			json: true,
			auth: {
				user: config.clientId,
				pass: config.clientSecret
			}
		}, function (err, resp, body) {
			if (err) {
				return resolve({
					type: 'getBroadcast',
					status: 'error',
					error: {
						message: 'Error getting broadcast (' + err.code + ')',
						code: 'network_error'
					}
				});
			}

			if (resp.statusCode >= 400) {
				return resolve({
					type: 'getBroadcast',
					status: 'error',
					error: get(body, 'reasons[0]', {
						message: 'Error getting broadcast',
						code: 'get_broadcast_error'
					})
				});
			}

			return resolve({
				type: 'getBroadcast',
				status: 'success',
				broadcastKey: body.broadcastKey,
				originServers: body.originServers
			});
		});
	});
}
