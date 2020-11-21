// OfflineAudiocontext thanks to: https://stackoverflow.com/questions/46621954/offlineaudiocontext-and-fft-in-safari

import { detectAudioContext } from '../detector';
import {
	calculateFrequency,
	calculateNote,
	calculateCents,
	toDecimals,
	throwError,
	logError,
} from '../helpers';

let options = {
	audioFile: null,
	callback: null,
	decimals: 2,
	entryPerSec: 1, // can be decimals - limit to max .1?
	onError: null,
	returnCents: false,
	returnNote: true,
	timeAveraging: 0.8,
};

const audioDataArray = [];
const FFTSize = 2048;
const sampleRate = 44100;

let audioContext;
let offlineCtx;
let bufferSource;
let analyser;
let processor;
let lastFrequency;

function processAudio({ playbackTime }) {
	const {
		decimals, entryPerSec, returnCents, returnNote,
	} = options;
	const frequencyData = new Float32Array(analyser.frequencyBinCount);

	analyser.getFloatFrequencyData(frequencyData); // Update frequencyData

	// Format time based on requested entryPerSec
	const timestamp = toDecimals((Math.round(playbackTime / entryPerSec) * entryPerSec), 1);
	const totalEntries = audioDataArray.length;

	if ((timestamp / entryPerSec) > totalEntries) {
		const frequency = calculateFrequency(frequencyData);

		const returnValue = {
			timestamp,
			frequency: toDecimals(frequency, decimals),
		};

		if (frequency) {
			if (returnNote) {
				const note = calculateNote(frequency, decimals);
				returnValue.note = note;
			}

			if (returnNote && returnCents) {
				if (lastFrequency) {
					const cents = calculateCents(frequency, lastFrequency);
					returnValue.cents = toDecimals(cents);
				}
				lastFrequency = frequency;
			}

			audioDataArray.push(returnValue);
		}
	}
}

function getAudioData(arrayBuffer) {
	const { callback, timeAveraging } = options;

	// Decode audio
	audioContext.decodeAudioData(arrayBuffer.target.result).then((decodedBuffer) => {
		offlineCtx = new OfflineAudioContext(2, decodedBuffer.length, sampleRate);
		bufferSource = offlineCtx.createBufferSource();
		analyser = offlineCtx.createAnalyser();
		analyser.fftSize = FFTSize;
		analyser.smoothingTimeConstant = timeAveraging;
		processor = offlineCtx.createScriptProcessor(FFTSize, 1, 1);

		bufferSource.buffer = decodedBuffer;
		bufferSource.connect(analyser);
		analyser.connect(processor);
		processor.connect(offlineCtx.destination);

		processor.onaudioprocess = processAudio;

		// Start the process
		bufferSource.start(0);

		// Start the render
		offlineCtx.startRendering().then((renderedBuffer) => {
			callback(audioDataArray);
		}).catch((err) => {
			logError(`Rendering failed: ${err}`);

			// onError()
		});
	}, false);
}

function fileAnalyse(args = {}) {
	audioContext = detectAudioContext();

	if (!args.callback) throwError('A callback needs to be passed to receive the return value');
	if (!audioContext) throwError('Your browser does not support Audio Context');

	options = { ...options, ...args };
	const { audioFile } = options;

	if (!audioFile) throwError('No audiofile provided');

	const fileReaderBuffer = new FileReader();
	fileReaderBuffer.onload = arrayBuffer => getAudioData(arrayBuffer);
	fileReaderBuffer.readAsArrayBuffer(audioFile);
}

export { fileAnalyse };
