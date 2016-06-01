import React from 'react';
import ReactDom from 'react-dom';
import Clipboard from 'clipboard';
var _clipInstance;
var _instances = [];

export class Clippee extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			coppied: false
		};
	}

	render () {
		/* eslint-disable */
		return (
			<button className={'clippee' + (this.state.coppied ? ' coppied' : '')} data-clipboard-text={this.props.text}>
				<span className="tooltip">Copy To Clipboard</span>
			</button>
		);
		/* eslint-enable */
	}

	componentDidMount () {
		if (!_clipInstance) {
			_clipInstance = new Clipboard('.clippee');

			_clipInstance.on('success', function (e) {
				_instances.forEach(function (i) {
					if (e.trigger === ReactDom.findDOMNode(i)) {
						i.onCopy(e);
					}
				});
			});
		}

		_instances.push(this);
	}

	componentWillUnmount () {
		_instances.splice(_instances.indexOf(this), 1);
		if (_clipInstance && _instances.length === 0) {
			_clipInstance.destroy();
			_clipInstance = null;
		}
	}

	onCopy () {
		this.setState({
			coppied: true
		});
		setTimeout(() => {
			this.setState({
				coppied: false
			});
		}, 250);
		if (typeof this.props.onCopy === 'function') {
			this.props.onCopy();
		}
	}
}

Clippee.propTypes = {
	text: React.PropTypes.string.isRequired,
	onCopy: React.PropTypes.func
};
