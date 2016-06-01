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
	ReactDom.render(<Page {...store} config={config} createUser={createUser} setupObs={setupObs} />, appEl);
}

// Create user workflow
function createUser (userData) {
	dispatcher.dispatch(submitCreateUserFormAction(config, userData));
}

// Auto setup obs
function setupObs (broadcastUrl, broadcastKey) {
	dispatcher.dispatch(setupObsAction(broadcastUrl, broadcastKey));
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
				message: 'OBS Setup Complete',
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
	getUserStream: function (action) {
		if (action.status === 'success') {
			if (action.user.slug === store.user.slug && (!store.stream || store.stream.slug !== store.user.slug && store.currentView !== 'stream')) {
				store = Object.assign({}, store, {
					userStream: action.stream,
					messages: [{
						message: React.createElement(StreamOnlineMessage, {viewStream: viewYourStream}),
						level: 'success',
						code: 'you_are_streaming'
					}]
				});
			}
		}
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
	}
});

// Kick things off
render();
dispatcher.dispatch(initAction(config));
