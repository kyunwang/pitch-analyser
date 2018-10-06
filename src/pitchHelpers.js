// Not used as of now
const checkInputDeviceExists = deviceId => navigator.mediaDevices.enumerateDevices()
	.then(devices => devices.some(device => device.deviceId === deviceId));

const getInputDevices = () => navigator.mediaDevices.enumerateDevices()
	.then(devices => devices.filter(device => device.kind === 'audioinput'));


export {
	checkInputDeviceExists,
	getInputDevices,
};
