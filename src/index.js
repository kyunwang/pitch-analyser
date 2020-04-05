import { detectAudioContext, detectGetUserMedia } from './detector';

import {
	calculateFrequency,
	calculateNote,
	calculateCents,
	toDecimals,
	throwError,
	logError,
} from './helpers';

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
	decimals: 2,
	// afterCloseCallback() {},
};

class PitchAnalyser {
	constructor(args) {
		this.args = args;
		this.lastFrequency = null;
		this.audioContext = null;

		// Bindings
		// this.initialize = this.initialize.bind(this);
		this.analysePitch = this.analysePitch.bind(this);
		this.streamReceived = this.streamReceived.bind(this);

		// Call initilize
		this.initialize();
	}

	closeContext(callback) {
		if (callback) {
			this.audioContext.close().then(() => callback());
		}
	}

	initialize() {
		// Feature detect and pass AudioContext to audioContext
		this.audioContext = detectAudioContext();
		getUserMedia = detectGetUserMedia();

		if (!(this instanceof PitchAnalyser)) {
			throwError("constructor needs to be called with the 'new' keyword");
		}

		// A callback needs to be passed during the development stage
		if (!this.args.callback) throwError('A callback needs to be passed');

		// Check whether the browser does support the feature. audioContext = false or window.AudioContext
		if (!this.audioContext) {
			logError('Your browser does not support Audio Context');
		}

		// getUserMedia = window.getUserMedia(went through feature detects) or false
		if (!getUserMedia) logError('Your brower does not support getUserMedia');

		// Pass user given arguments to the options
		options = { ...options, ...this.args };

		// Start media stream
		getUserMedia({ audio: true })
			.then(this.streamReceived)
			.catch(throwError);
	}

	// Get the frequencies and return values based on options
	analysePitch() {
		audioAnalyser.getFloatFrequencyData(frequencies);
		audioAnalyser.getByteTimeDomainData(amplitude);

		const frequency = calculateFrequency(frequencies);

		if (frequency) {
			const {
				returnCents, returnNote, decimals, callback,
			} = options;

			const returnValue = {
				frequency: toDecimals(frequency, decimals),
			};

			if (returnNote) {
				const note = calculateNote(frequency);
				returnValue.note = note;
			}

			if (returnNote && returnCents) {
				if (this.lastFrequency) {
					const cents = calculateCents(frequency, this.lastFrequency);
					returnValue.cents = toDecimals(cents, decimals);
				}
				this.lastFrequency = frequency;
			}

			// Execute the callback. (Intended for returning the output)
			callback(returnValue);
		}

		// Tells the browser we wish to perform a animation. Call callback before repaint
		window.requestAnimationFrame(this.analysePitch);
	}

	streamReceived(stream) {
		// Set the stream to audioStream
		audioStream = stream;

		// Initialize and assign a audio analyser
		audioAnalyser = this.audioContext.createAnalyser();

		// Create frequencies arrayholder
		frequencies = new Float32Array(audioAnalyser.frequencyBinCount);

		//
		amplitude = new Uint8Array(audioAnalyser.frequencyBinCount);

		// Create amplifier
		volume = this.audioContext.createGain();

		// Assign a stream source as main source
		audioSource = this.audioContext.createMediaStreamSource(audioStream);

		// Connect the audio to the amplifier
		audioSource.connect(volume);

		// Connect the audio to our analyser
		audioSource.connect(audioAnalyser);

		// Start note detection
		this.analysePitch();
	}
}

export default PitchAnalyser;
