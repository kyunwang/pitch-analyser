import { detectAudioContext, detectGetUserMedia } from './detector';

import analyseFrequency from './analyseFrequency';

let audioCtx;
let getUserMedia;

// Predefine variables
let audioSource;
let audioAnalyser;
let audioStream;

let frequencies;
let frequency;
let amplitude;
let volume;

// Default of options
let options = {
	microphone: true,
	audioFile: false,
	callback: null,
	returnNote: true,
	returnCents: false,
	afterCloseCallback() {},
};

// Handle error
function throwError(err) {
	throw new Error(`Something went wrong: ${err}`);
}

function logError(err) {
	console.error(err);
}

function detectNote() {
//   const buffer = new Uint8Array(audioAnalyser.fftSize);
	//   audioAnalyser.getByteTimeDomainData(buffer);
	audioAnalyser.getFloatFrequencyData(frequencies);
	audioAnalyser.getByteTimeDomainData(amplitude);

	frequency = analyseFrequency(frequencies);

	if (frequency) {
		const {
			returnCents,
			callback,
		} = options;

		const returnValue = {
			frequency,
		};

		if (returnCents) {}

		callback(returnValue);

		// Execute the callback. (Intended for returning the output)
		options.callback(returnValue);
	}

	// Tells the browser we wish to perform a animation. Call callback before repaint
	window.requestAnimationFrame(detectNote);
}

// Call when the stream has connected
function streamReceived(stream) {
	// Set the stream to audioStream
	audioStream = stream;

	// Initialize and assign a audio analyser
	audioAnalyser = audioCtx.createAnalyser();

	// Create frequencies arrayholder
	frequencies = new Float32Array(audioAnalyser.frequencyBinCount);

	//
	amplitude = new Uint8Array(audioAnalyser.frequencyBinCount);

	// Create amplifier
	volume = audioCtx.createGain();

	// Assign a stream source as main source
	audioSource = audioCtx.createMediaStreamSource(audioStream);

	// Connect the audio to the amplifier
	audioSource.connect(volume);
	// Connect the audio to our analyser
	audioSource.connect(audioAnalyser);

	// Start note detection
	detectNote();
}

const PitchAnalyser = function (args) {
	// Feature detect and pass AudioContext to audioCtx
	audioCtx = detectAudioContext();
	getUserMedia = detectGetUserMedia();

	if (!(this instanceof PitchAnalyser)) throwError("constructor needs to be called with the 'new' keyword");

	// A callback needs to be passed during the development stage
	if (!args.callback) throwError('A callback needs to be passed');

	// Check whether the browser does support the feature. audioCtx = false or window.AudioContext
	if (!audioCtx) logError('Your browser does not support Audio Context');

	// getUserMedia = window.getUserMedia(went through feature detects) or false
	if (!getUserMedia) logError('Your brower does not support getUserMedia');


	// Pass user given arguments to the options
	options = { ...options, ...args };

	// Depends on the refactored code for now
	// if (options.returnCents && options.returnNote === false) throwError("'returnNote' should be 'true' to get access to the 'cents");

	// Start media stream
	getUserMedia({ audio: true })
		.then(streamReceived)
		.catch(throwError);


	/*= =========================
  === Class methods
  =========================== */
	// Set the close function
	this.close = function () {
		audioCtx.close().then(() => {
			options.afterCloseCallback();
		});
	};
};

module.exports = PitchAnalyser;
