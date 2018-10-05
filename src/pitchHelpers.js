const getInputDevices = () => {
	return navigator.mediaDevices.enumerateDevices()
		.then(devices => {
			return devices.filter(device => device.kind === 'audioinput');
		})
}

export {
	getInputDevices,
}
