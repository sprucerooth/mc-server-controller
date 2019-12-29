import Axios from "axios";

export const apiHost = 'http://ec2-13-48-192-171.eu-north-1.compute.amazonaws.com:8080/minecraft-server/';

export const requestUrls = {
	status: apiHost + 'status',
	start: apiHost + 'start',
	stop: apiHost + 'stop',
}

export async function requestServerStatus() {
	const response = await Axios.get(requestUrls.status);
	return response.data;
}

export async function requestStartServer() {
	await Axios.post(requestUrls.start);
}

export async function requestStopServer() {
	await Axios.post(requestUrls.stop);
}

export async function getServerStatusName() {
	const response = await requestServerStatus();
	const serverStatusName =
		response &&
		response.Reservations &&
		response.Reservations[0] &&
		response.Reservations[0].Instances &&
		response.Reservations[0].Instances[0] &&
		response.Reservations[0].Instances[0].State &&
		response.Reservations[0].Instances[0].State.Name;

	return serverStatusName;
}