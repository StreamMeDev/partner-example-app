import React from 'react';
import {Clippee} from './clippee';
import {FlyoutMenu, FlyoutToggle} from '@streammedev/flyout';

export class StartStream extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showKey: false,
			keyCoppied: false,
			selectedOrigin: props.originServers[0]
		};
		this.toggleShowKey = this.toggleShowKey.bind(this);
		this.resetStreamKey = this.resetStreamKey.bind(this);
		this.setOrigin = this.setOrigin.bind(this);
		this.setupObs = this.setupObs.bind(this);
	}

	render () {
		/* eslint-disable */
		return (
			<div className="start-stream">
				<div className="intro-section">
					<h1>Hey <span className="emphasis">{this.props.user.username}</span>, </h1>
					<p>Lets get streaming! If you already know what to do just grab your stream key and RTMP server below, if not <a href="https://www.stream.me/obs" target="_blank">hop over here</a> to follow our detailed instructions.</p>
				</div>

				<div className="manual-setup">
					<h2><span className="emphasis">Stream</span> Setup</h2>

					<div className="origin-server">
						<h4>Origin Server</h4>
						<div className="origin-server-wrapper">
							<Clippee text={this.state.selectedOrigin.broadcastUrl} />
							<FlyoutMenu className="origins">
								<FlyoutToggle className="origins-toggle">{this.state.selectedOrigin.broadcastUrl}</FlyoutToggle>
								{this.props.originServers.map(function (o) {
									return <div className="origin" key={o.region + o.broadcastUrl} itemKey={o.region + o.broadcastUrl} onClick={this.setOrigin.bind(this, o)}>{o.region}</div>;
								}.bind(this))}
							</FlyoutMenu>
						</div>
					</div>

					<div className="stream-key">
						<h4>Stream Key</h4>
						<button className={'stream-key-toggle' + (this.state.showKey ? ' showing' : '')} onClick={this.toggleShowKey}>
							{this.state.showKey ? 'Hide Stream Key' : 'Show Stream Key'}
						</button>
						{this.state.showKey ? (
							<div className="stream-key-hidden">
								<div className="stream-key-wrapper">
									<Clippee text={this.props.broadcastKey} />
									<span className="stream-key-text">{this.props.broadcastKey}</span>
								</div>
								<button className="stream-key-reset" onClick={this.resetStreamKey}>Reset Stream Key</button>
							</div>
						) : false}
					</div>

					{this.props.obsInstalled ? (
						<div className="obs-setup">
							<h2>OBS Studio <span className="emphasis">Fast</span> Setup</h2>
							<p>It looks like you already have OBS installed, we can setup a StreamMe profile right from the app so you can get started streaming with ease.  Click below then select the StreamMe profile from OBS to get streaming.</p>
							<button onClick={this.setupObs} className="auto-obs-setup">Auto-Magically Configure OBS</button>
						</div>
					) : false}
				</div>
			</div>
		);
		/* eslint-enable */
	}

	toggleShowKey (e) {
		this.setState({
			showKey: !this.state.showKey
		});
	}

	resetStreamKey (e) {
		// do stuff
	}

	setupObs (e) {
		if (typeof this.props.setupObs === 'function') {
			this.props.setupObs(this.state.selectedOrigin.broadcastUrl, this.props.broadcastKey);
		}
	}

	setOrigin (origin) {
		this.setState({
			selectedOrigin: origin
		});
	}
}
