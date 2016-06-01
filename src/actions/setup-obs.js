import fs from 'fs';
import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp';
import {dispatcher} from '../dispatcher';

var obsProfilesPath;
if (process.platform === 'darwin') {
	obsProfilesPath = path.join(os.homedir(), 'Library', 'Application Support', 'obs-studio', 'basic', 'profiles', 'StreamMe');
}

export function setupObsAction (broadcastUrl, broadcastKey) {
	// notify of starting
	dispatcher.dispatch({
		type: 'setupObs',
		status: 'loading'
	});

	return new Promise(function setupObs (resolve) {
		mkdirp(obsProfilesPath, function (err) {
			if (err) {
				return resolve({
					type: 'setupObs',
					status: 'error',
					error: {
						message: 'Unable to create profile directory (' + err.code + ')',
						code: 'fs_error'
					}
				});
			}

			fs.writeFile(path.join(obsProfilesPath, 'basic.ini'), '[General]\nName=StreamMe', function (err) {
				if (err) {
					return resolve({
						type: 'setupObs',
						status: 'error',
						error: {
							message: 'Error creating basic.ini (' + err.code + ')',
							code: 'fs_error'
						}
					});
				}

				fs.writeFile(path.join(obsProfilesPath, 'service.json'), JSON.stringify({
					settings: {
						key: broadcastKey,
						server: broadcastUrl
					},
					type: 'rtmp_custom'
				}, '\t'), function (err) {
					if (err) {
						return resolve({
							type: 'setupObs',
							status: 'error',
							error: {
								message: 'Error setting up OBS profile (' + err.code + ')',
								code: 'fs_error'
							}
						});
					}

					resolve({
						type: 'setupObs',
						status: 'success'
					});
				});
			});
		});
	});
}
