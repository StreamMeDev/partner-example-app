import React from 'react';

export class Stream extends React.Component {
	render () {
		/* eslint-disable */
		return (
			<div className="view-stream">
				<div className="stream">
					<iframe className="stream-embed" src={this.props.config.embedHostname + '/stream-embed/' + this.props.stream.userSlug + '/' + this.props.config.clientSlug + '/fullframe'} />
				</div>
			</div>
		);
		/* eslint-enable */
	}
}
