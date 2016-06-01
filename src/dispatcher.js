import {EventEmitter} from 'events';

export let dispatcher = new EventEmitter();

dispatcher.dispatch = function (action) {
	// This can happen if a promise does not return an action
	if (!action) {
		return;
	}

	// Async action
	function _dispatch (_action) {
		dispatcher.dispatch(_action);
	}
	if (action instanceof Promise) {
		return action.then(_dispatch, _dispatch);
	}

	// Sync action
	dispatcher.emit(action.type, action);
};

dispatcher.subscribe = function (name, fnc) {
	// Accept an object of event/func pairs
	if (typeof name === 'object') {
		var unsubscribes = [];
		for (var n in name) {
			unsubscribes.push(dispatcher.subscribe(n, name[n]));
		}
		return function () {
			var u;
			while (u = unsubscribes.shift()) { // eslint-disable-line no-cond-assign
				u();
			}
		};
	}

	return dispatcher.on(name, fnc);
};
