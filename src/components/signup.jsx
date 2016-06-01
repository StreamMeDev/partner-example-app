import React from 'react';

export class SignUp extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			username: props.username || '',
			email: props.email || ''
		};
		this.changeUsername = this.changeUsername.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	render () {
		/* eslint-disable */
		return (
			<div className="signup">
				<h1 className="primary-header"><span className="emphasis">StreamMe</span> Partner Example</h1>
				<form onSubmit={this.onSubmit}>
					<h3>Register an account:</h3>

					<div className="field">
						<label htmlFor="username">Username</label>
						<input 
							type="username"
							autoFocus
							required
							className={this.state.username === '' ? 'empty' : ''}
							min-length="2"
							name="username"
							placeholder="ImSoFancy"
							onChange={this.changeUsername}
							value={this.state.username}
						/>
					</div>
					
					<div className="field">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							required
							className={this.state.email === '' ? 'empty' : ''}
							name="email"
							pattern="[^ @]*@[^ @]*"
							min-length="3"
							placeholder="fancy_pants@aol.com"
							onChange={this.changeEmail}
							value={this.state.email}
						/>
					</div>

					<button type="submit" className="button" disabled={this.state.username === '' || this.state.email === ''}>Lets Go!</button>
				</form>
			</div>
		);
		/* eslint-enable */
	}

	changeUsername (e) {
		this.setState({
			username: e.target.value
		});
	}

	changeEmail (e) {
		this.setState({
			email: e.target.value
		});
	}

	onSubmit (e) {
		e.preventDefault();
		if (typeof this.props.onSubmit === 'function') {
			this.props.onSubmit({
				username: this.state.username,
				email: this.state.email
			});
		}
	}
}
