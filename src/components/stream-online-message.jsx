import React from 'react';

export function StreamOnlineMessage (props) {
	return (
		<span>You are online! <a onClick={props.viewStream}>View your stream now.</a></span>
	);
}
