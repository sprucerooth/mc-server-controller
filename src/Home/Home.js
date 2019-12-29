import React, { useState, useEffect } from 'react';
import './Home.css';
import { requestStopServer, requestStartServer, getServerStatusName } from '../api';

const toggleServerbuttonTexts = {
	start: 'Start',
	stop: 'Stop'
};

const serverStatuses = {
	running: {
		name: 'running',
		color: 'green',
		text: 'Running...'
	},
	stopped: {
		name: 'stopped',
		color: 'grey',
		text: 'Stopped'
	},
	stopping: {
		name: 'stopping',
		color: 'orange',
		text: 'Stopping...'
	},
	pending: {
		name: 'pending',
		color: 'yellow',
		text: 'Pending...'
	},
	error: {
		name: 'error',
		color: 'red',
		text: 'Error'
	}
}

function Home() {
	const [toggleServerButtonText, setToggleServerButtonText] = useState(toggleServerbuttonTexts.start);
	const [toggleServerButtonDisabled, setToggleServerButtonDisabled] = useState(true);
	const [serverStatus, setServerStatus] = useState({ ...serverStatuses.pending });
	const [refreshButtonDisabled, setRefreshButtonDisabled] = useState(false);
	// Interval to fetch server status
	const [time, setTime] = useState(0);

	// Initialized
	useEffect(() => {
	}, []);

	useEffect(() => {
		// console.log('Timer ', time, ' status: ', serverStatus.name);

		// Poll server status with an interval of 1 sec for 5 seconds.
		// Will be very asynchronous(will not wait for the status fetch to be ready before starting another timer) but it's fine! Server fetch will happen for each timeout trigger
		// but new timers will still continue to go off.
		let timer;
		if (time !== -1) {
			setRefreshButtonDisabled(true);
			timer = setTimeout(() => {
				// console.log('Timer ', time, ' triggered with status: ', serverStatus.name);
				setTime(time + 1);
				updateStatusFromRequest(serverStatus);
			}, 1000);
			if (time > 5) setTime(-1);
		}
		if (timer != null) {
			return () => clearTimeout(timer);
		}
		setRefreshButtonDisabled(false);
		return;
	}, [time]);

	// Check serverStatus state change to update button text and if button should be disabled.
	useEffect(() => {
		// Set button label
		switch (serverStatus.name) {
			case serverStatuses.error.name:
			case serverStatuses.stopped.name:
				setToggleServerButtonText(toggleServerbuttonTexts.start);
				break;
			default:
				setToggleServerButtonText(toggleServerbuttonTexts.stop);
				break;
		}

		// Disable button depending on status
		switch (serverStatus.name) {
			case serverStatuses.stopping.name:
			case serverStatuses.pending.name:
				setToggleServerButtonDisabled(true);
				break;
			default:
				setToggleServerButtonDisabled(false);
		}
	}, [serverStatus]);

	const toggleStartServer = () => {
		if (toggleServerButtonDisabled) { // Don't allow click if disabled
			return;
		}
		refresh();
		if (toggleServerButtonText === toggleServerbuttonTexts.start) {
			requestStartServer();
			return;
		}
		// The text
		requestStopServer();
		return
	}

	const refresh = () => {
		setServerStatus({ ...serverStatuses.pending });
		setTime(0);
	}

	const updateStatusFromRequest = async (serverStatus) => {
		// setServerStatus({ ...serverStatuses.pending });
		const serverStatusName = await getServerStatusName(serverStatus);
		// console.log('Current serverStatus:', serverStatusName, ', Previous serverStatus: ', serverStatus.name);

		// Check if status is the same then don't update state
		if (serverStatusName &&
			serverStatuses[serverStatusName] &&
			(serverStatuses[serverStatusName].name !== serverStatus.name)) {
			setServerStatus({ ...serverStatuses[serverStatusName] });
		};
	}

	return (
		<div>
			<div className="status-text">
				<span style={{ color: serverStatus.color }}>{serverStatus.text}</span>
			</div>
			<button type="button" onClick={refresh} className={'refresh-button mc-button ' + (refreshButtonDisabled ? 'disabled' : '')} >
				<div className="inner-bevel">Refresh</div>
			</button>
			<div className="home">
				<content className="content">
					<button type="button" onClick={toggleStartServer} className={'toggle-server-button mc-button ' + (toggleServerButtonDisabled ? 'disabled' : '')} >
						<div className="inner-bevel">{toggleServerButtonText}</div>
					</button>
				</content>
			</div>
		</div>
	);
}

export default Home;
