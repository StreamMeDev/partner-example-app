import React from 'react';
import {SignUp} from './signup';
import {StartStream} from './start-stream';
import {Stream} from './stream';
import {default as ReactCSSTransitionGroup} from 'react-addons-css-transition-group';

export class Page extends React.Component {
	render () {
		/* eslint-disable */
		return (
			<div className="container">
				<div className="draggable-bar" />
				{this.props.messages && this.props.messages.length ? (
					<div className="messages">
						{this.props.messages.map((m) => {
							return <div className={'message ' + (m.level || 'error')} key={m.code || m.message}>{m.message}</div>
						})}
					</div>
				) : false}
				<ReactCSSTransitionGroup transitionName="page-change" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{[this.renderCurrentView()]}
				</ReactCSSTransitionGroup>
				{this.props.loading ? (
					<div key="loading" className="loading">
						<div className="loading-dot" />
						<div className="loading-dot" />
						<div className="loading-dot" />
					</div>
				) : false}
			</div>
		);
		/* eslint-enable */
	}

	renderCurrentView () {
		/* eslint-disable */
		switch (this.props.currentView) {
		case 'signup':
			return <SignUp key="signup" onSubmit={this.props.createUser} />;
		case 'start-stream':
			return (
				<StartStream
					key="start-stream"
					user={this.props.user}
					broadcastKey={this.props.broadcastKey}
					originServers={this.props.originServers}
					obsInstalled={this.props.obsInstalled}
					setupObs={this.props.setupObs}
					resetStreamKey={this.props.resetStreamKey}
					logout={this.props.logout}
				/>
			);
		case 'stream':
			return (
				<Stream key="stream" config={this.props.config} stream={this.props.stream} />
			);
		}
		/* eslint-enable */
	}
}
