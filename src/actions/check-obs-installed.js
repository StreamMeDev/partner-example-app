import fs from 'fs';
import path from 'path';
import {dispatcher} from '../dispatcher';

var obsPath;
if (process.platform === 'darwin') {
	obsPath = '/Applications/OBS.app';
}

export function checkObsInstalledAction () {
	return new Promise(function checkObsInstalled (resolve) {
		fs.access(obsPath, fs.X_OK, function (err) {
			resolve({
				type: 'checkObsInstalled',
				status: 'success',
				installed: !err
			});
		});
	});
}
