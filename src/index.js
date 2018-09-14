import { detectAudioContext, detectGetUserMedia } from './detector';

import {
	calculateFrequency,
	calculateNote,
	calculateCents,
	toDecimals,
	throwError,
	logError,
} from './helpers';

let audioCtx;
let getUserMedia;

// Predefine variables
let audioSource;
let audioAnalyser;
let audioStream;

let frequencies;
let amplitude;
let volume;

// Default of options
let options = {
	microphone: true,
	audioFile: false,
	callback: null,
	returnNote: true,
	returnCents: false,
	decimals: 0,
	afterCloseCallback() {},
};


const PitchAnalyser = function (args) {
	/*= =========================
	=== Class values
	=========================== */
	this.lastFrequency = null;

	/*= =========================
  === Class methods
  =========================== */
	// Set the close function
	this.close = () => {
		audioCtx.close().then(() => {
			options.afterCloseCallback();
			window.cancelAnimationFrame();
		});
	};

	// Get the frequencies and return values based on options
	this.analysePitch = () => {
		audioAnalyser.getFloatFrequencyData(frequencies);
		audioAnalyser.getByteTimeDomainData(amplitude);

		const frequency = calculateFrequency(frequencies);

		if (frequency) {
			const {
				returnCents,
				returnNote,
				decimals,
				callback,
			} = options;

			const returnValue = {
				frequency: decimals ? toDecimals(frequency, decimals) : frequency,
			};

			if (returnNote) {
				const note = calculateNote(frequency);
				returnValue.note = note;
			}

			if (returnCents) {
				if (this.lastFrequency) {
					const cents = calculateCents(frequency, this.lastFrequency);
					returnValue.cents = decimals ? toDecimals(cents, decimals) : cents;
				}
				this.lastFrequency = frequency;
			}

			// Execute the callback. (Intended for returning the output)
			callback(returnValue);
		}

		// Tells the browser we wish to perform a animation. Call callback before repaint
		window.requestAnimationFrame(this.analysePitch);
	};

	this.streamReceived = (stream) => {
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
		this.analysePitch();
	};

	/*= =========================
	=== Initialization steps
	=========================== */

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

	// Start media stream
	getUserMedia({ audio: true })
		.then(this.streamReceived)
		.catch(throwError);
};

module.exports = PitchAnalyser;
