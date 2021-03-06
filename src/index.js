import React from 'react';
import ReactDom from 'react-dom';
import {Page} from './components/page';
import {StreamOnlineMessage} from './components/stream-online-message';
import {dispatcher} from './dispatcher';
import {initAction} from './actions/init';
import {submitCreateUserFormAction} from './actions/submit-create-user-form';
import {setupObsAction} from './actions/setup-obs';
import {startPollingUserStreamAction} from './actions/start-polling-user-stream';
import {stopPollingUserStreamAction} from './actions/stop-polling-user-stream';
import {getUserStreamAction} from './actions/get-user-stream';
import {viewStreamAction} from './actions/view-stream';
import {resetStreamKeyAction} from './actions/reset-stream-key';
import {logoutAction} from './actions/logout';
import {changeCurrentViewAction} from './actions/change-current-view';

// Load up the config from the main process
var config = require('../config')(require('electron').remote.app);

// Global application state ala flux/redux
var store = {
	currentView: null,
	loading: true,
	obsInstalled: false
};

// Cache the app root element
var appEl = document.getElementById('app');

// A method to render the react component
function render () {
	ReactDom.render(<Page
		{...store}
		config={config}
		createUser={createUser}
		setupObs={setupObs}
		resetStreamKey={resetStreamKey}
		logout={logout}
	/>, appEl);
}

// Create user workflow
function createUser (userData) {
	dispatcher.dispatch(submitCreateUserFormAction(config, userData));
}

// Auto setup obs
function setupObs (broadcastUrl, broadcastKey) {
	dispatcher.dispatch(setupObsAction(broadcastUrl, broadcastKey));
}

// Reset stream key
function resetStreamKey () {
	dispatcher.dispatch(resetStreamKeyAction(config, store.user));
}

// Logout user
function logout () {
	dispatcher.dispatch(logoutAction(config));
}

// View your stream
function viewYourStream () {
	dispatcher.dispatch(viewStreamAction(config, store.user));
}

// We are going to poll user streams with a setInterval, possiably multiple streams at once
var _userStreamPoll = {};

// Subscribe to our dispatcher
dispatcher.subscribe({
	changeCurrentView: function (action) {
		store = Object.assign({}, store, {
			loading: false,
			currentView: action.view,
			messages: []
		});
		render();
	},
	checkObsInstalled: function (action) {
		store = Object.assign({}, store, {
			obsInstalled: action.installed
		});
		render();
	},
	setupObs: function (action) {
		var state = {};
		if (action.status === 'loading') {
			state.loading = true;
		} else if (action.status === 'error') {
			state.messages = [action.error];
			state.loading = false;
		} else {
			state.messages = [{
				message: 'OBS setup complete, go start streaming!',
				level: 'success',
				code: 'obs_success'
			}];
			state.loading = false;
		}

		store = Object.assign({}, store, state);
		render();
	},
	loadUser: function (action) {
		// Build new state
		if (action.status === 'success') {
			// Start polling for the users stream
			dispatcher.dispatch(startPollingUserStreamAction(action.user));

			// Merge in user
			store = Object.assign({}, store, {
				user: action.user
			});
			render();
		}
	},
	createUser: function (action) {
		// Build new state
		var state = {};
		if (action.status === 'loading') {
			state.loading = true;
		} else if (action.status === 'error') {
			state.messages = [action.error];
			state.loading = false;
		} else {
			state.user = action.user;

			// Start polling for new user
			dispatcher.dispatch(startPollingUserStreamAction(action.user));
		}

		// Merge in new state
		store = Object.assign({}, store, state);
		render();
	},
	getBroadcast: function (action) {
		var state = {};
		if (action.status === 'loading') {
			state.loading = true;
		} else if (action.status === 'error') {
			state.messages = [action.error];
			state.loading = false;
		} else {
			state.broadcastKey = action.broadcastKey;
			state.originServers = action.originServers;
			state.loading = false;
		}

		// Merge in new state
		store = Object.assign({}, store, state);
		render();
	},
	resetStreamKey: function (action) {
		var state = {};
		if (action.status === 'error') {
			state.messages = [action.error];
		} else {
			state.broadcastKey = action.broadcastKey;
		}

		// Merge in new state
		store = Object.assign({}, store, state);
		render();
	},
	getUserStream: function (action) {
		var state = {};
		if (action.status === 'success') {
			// Is this the current users stream?
			if (action.user.slug === store.user.slug) {
				state.userStream = action.stream;

				// If it is also online and we are not viewing it, show the banner
				if (action.stream.active && (!store.stream || store.stream.slug !== store.user.slug) && store.currentView !== 'stream') {
					state.messages = [{
						message: React.createElement(StreamOnlineMessage, {viewStream: viewYourStream}),
						level: 'success',
						code: 'you_are_streaming'
					}]
				}
			}

			// Check if this is the stream we are viewing
			if (store.stream && action.stream.slug === store.stream.slug) {
				state.stream = action.stream;
			}
		}
		store = Object.assign({}, store, state);
		render();
	},
	startPollingUserStream: function (action) {
		// clear any existing poll if we have one
		if (_userStreamPoll[action.user.slug]) {
			dispatcher.dispatch(stopPollingUserStreamAction(action.user));
		}

		_userStreamPoll[action.user.slug] = setInterval(function () {
			dispatcher.dispatch(getUserStreamAction(config, action.user));
		}, 5000);
	},
	stopPollingUserStream: function (action) {
		clearInterval(_userStreamPoll[action.user.slug]);
	},
	viewStream: function (action) {
		var state = {};
		if (action.status === 'loading') {
			state.loading = true;
		} else if (action.status === 'error') {
			state.messages = [action.error];
			state.loading = false;
		} else {
			state.stream = action.stream;
		}

		// Merge in new state
		store = Object.assign({}, store, state);
		render();
	},
	logout: function (action) {
		var state = {};
		if (action.status === 'loading') {
			state.loading = true;
		} else if (action.status === 'error') {
			state.messages = [action.error];
			state.loading = false;
		} else {
			state.user = null;
			// Change to logged out view
			dispatcher.dispatch(changeCurrentViewAction('signup'));
		}

		// Merge in new state
		store = Object.assign({}, store, state);
		render();
	}
});

// Kick things off
render();
dispatcher.dispatch(initAction(config));
